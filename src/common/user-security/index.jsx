import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, message, Spin } from "antd";
import {
  LockOutlined,
  SafetyOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import crypto from "utils/crypto";
import { useNavigate } from "react-router-dom";
import {
  verifySimpleQuestion,
  getQ3Question,
  verifyQ3Question,
  verifyQ4Question,
  findUserByUsername,
} from "./services";
import "./index.less";

const { Item } = Form;
const UserSecurity = (onSuccess) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // phase: 0=username, 1=questions, 2=final(reset/failed)
  const [phase, setPhase] = useState(0);
  const [loading, setLoading] = useState(false);
  // question bank & sequence
  const [q3question, setQ3question] = useState(""); // null = loading; [] = loaded but empty
  const [sequence, setSequence] = useState(null); // null = not ready, else array length 4
  const [currentIndex, setCurrentIndex] = useState(0);

  // scoring
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [verificationPassed, setVerificationPassed] = useState(false);

  // draft for q4 textarea
  const [q4QuestionDraft, setQ4QuestionDraft] = useState("");
  const [userId, setUserId] = useState(null);

  const unAuthorizationPayload = userId ? { unAuthorizationId: userId } : {};

  const q3QuestionGet = async () => {
    const res = await getQ3Question(unAuthorizationPayload);
    if (res.success) {
      setQ3question(res.data.question);
    }
  };

  // 初始化（如果 localStorage 有 userId）
  useEffect(() => {
    const id = localStorage.getItem("userId");
    const decrypted = id ? crypto.decrypt(id) : null;
    if (decrypted) {
      // 异步初始化，并在初始化完成后 setPhase(1)
      initSequenceAndBank(parseInt(decrypted, 10), null).catch(() => {});
    }
  }, []);

  // 初始化序列与题库（仅当全部准备好后才设置 phase -> questions）
  const initSequenceAndBank = async () => {
    setLoading(true);
    try {
      const qa = Math.random() > 0.5 ? "number" : "letter";
      const qb = qa === "number" ? "letter" : "number";
      const seq = [
        { key: "QA", qtype: qa },
        { key: "Q3", qtype: "preset" },
        { key: "QB", qtype: qb },
        { key: "Q4", qtype: "custom" },
      ];

      // 一次性设置好所有需要的 state，避免分散更新导致竞态
      setSequence(seq);
      setCurrentIndex(0);
      setCorrectCount(0);
      setWrongCount(0);
      setVerificationPassed(false);

      // 只有完全准备好才能进入题目阶段
      setPhase(1);
    } finally {
      setLoading(false);
    }
  };

  // 用户名提交
  const handleUsernameSubmit = async ({ username }) => {
    setLoading(true);
    try {
      const res = await findUserByUsername({ username });
      if (res.success) {
        setUserId(res.data.id);
        initSequenceAndBank(parseInt(res.data.id, 10), null).catch(() => {});
        return;
      }
      message.warning("验证不通过");
    } catch (e) {
      message.warning(e.message);
    } finally {
      setLoading(false);
    }
  };

  // 当 sequence 存在且 currentIndex 超过长度 -> 做最终判定（放在 effect，避免 render 中 setState）
  useEffect(() => {
    if (!sequence) return;
    if (currentIndex >= sequence.length) {
      const passed = correctCount >= 3;
      setVerificationPassed(passed);
      setPhase(2);
    }
  }, [correctCount, currentIndex, sequence]);

  // 提交当前题答案
  const handleSubmitAnswer = async (values) => {
    if (!sequence) return;
    const item = sequence[currentIndex];
    if (!item) return;

    setLoading(true);
    try {
      let payload = {};
      let API = () => true;
      if (item.key === "QA" || item.key === "QB") {
        payload = {
          type: item.qtype,
          answer: values.answer,
          correctCount,
          wrongCount,
        };
        API = verifySimpleQuestion;
      } else if (item.key === "Q3") {
        API = verifyQ3Question;
        payload = { answer: values.q3Answer };
      } else {
        API = verifyQ4Question;
        payload = {
          question: values.q4Question,
          answer: values.q4Answer,
        };
      }

      const res = await API({
        ...payload,
        ...unAuthorizationPayload,
      });

      // 先计算新的 correct / wrong
      const newCorrect = correctCount + (res.success ? 1 : 0);
      const newWrong = wrongCount + (res.success ? 0 : 1);

      // 立即判断阈值
      if (newCorrect >= 3) {
        setCorrectCount(newCorrect);
        setWrongCount(newWrong);
        setVerificationPassed(true);
        setPhase(2); // 通过
        form.resetFields();
        return;
      }
      if (newWrong >= 2) {
        setCorrectCount(newCorrect);
        setWrongCount(newWrong);
        setVerificationPassed(false);
        setPhase(2); // 失败
        form.resetFields();
        return;
      }
      // 都未达到阈值，推进到下一题
      setCorrectCount(newCorrect);
      setWrongCount(newWrong);
      if (currentIndex === 0) {
        await q3QuestionGet();
      }

      setCurrentIndex((idx) => idx + 1);
      form.resetFields();
    } catch (e) {
      message.warning(e.message);
    } finally {
      setLoading(false);
    }
  };

  /* ----- 渲染当前题 ----- */
  const renderCurrentQuestion = () => {
    // 如果 sequence 还没准备好或题库没准备好，显示 loading（不会误判失败）
    if (!sequence || q3question === null) {
      return (
        <div style={{ textAlign: "center", padding: 36 }}>
          <Spin tip="加载中..." />
        </div>
      );
    }

    const item = sequence[currentIndex];
    if (!item) {
      // sequence exhausted； effect 会把 phase 切到 2，因此这里显示 loading
      return (
        <div style={{ textAlign: "center", padding: 28 }}>
          <Spin tip="判定结果..." />
        </div>
      );
    }

    // QA/QB
    if (item.key === "QA" || item.key === "QB") {
      const isNumber = item.qtype === "number";
      return (
        <Form form={form} onFinish={handleSubmitAnswer} layout="vertical">
          <div className="question-card">
            <div className="question-header">
              <SafetyOutlined style={{ color: "#0eb0c9" }} />
              <span>
                第 {currentIndex + 1} 题 · {item.key}
              </span>
            </div>
            <div className="question-text">
              {isNumber
                ? "请输入数字密保（0 - 1000）"
                : "请输入字母密保（1 - 3 个字母）"}
            </div>
          </div>

          <Item
            name="answer"
            rules={[{ required: true, message: "请输入答案" }]}
          >
            <Input
              placeholder={isNumber ? "输入数字" : "输入字母"}
              size="large"
              maxLength={isNumber ? 4 : 3}
            />
          </Item>

          <Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              提交本题
            </Button>
          </Item>
        </Form>
      );
    }

    // Q3
    if (item.key === "Q3") {
      return (
        <Form form={form} onFinish={handleSubmitAnswer} layout="vertical">
          <div className="question-card">
            <div className="question-header">
              <SafetyOutlined style={{ color: "#0eb0c9" }} />
              <span>
                第 {currentIndex + 1} 题 · {q3question}
              </span>
            </div>
            <div className="question-text">
              请回答（不允许特殊字符，30 字以内）
            </div>
          </div>
          <Item
            name="q3Answer"
            rules={[{ required: true, message: "请输入答案" }]}
          >
            <Input
              placeholder="请输入答案（不含特殊字符，最多 30 字）"
              size="large"
            />
          </Item>

          <Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              提交本题
            </Button>
          </Item>
        </Form>
      );
    }

    // Q4
    if (item.key === "Q4") {
      return (
        <Form form={form} onFinish={handleSubmitAnswer} layout="vertical">
          <div className="question-card">
            <div className="question-header">
              <SafetyOutlined style={{ color: "#0eb0c9" }} />
              <span>第 {currentIndex + 1} 题 · 自定义问题</span>
            </div>
            <div className="question-text">
              请输入自定义问题与答案（均必填）
            </div>
          </div>

          <Item
            name="q4Question"
            rules={[{ required: true, message: "请输入问题" }]}
          >
            <Input
              placeholder="例如：我高中班主任的姓名是？"
              size="large"
              value={q4QuestionDraft}
              onChange={(e) => setQ4QuestionDraft(e.target.value)}
            />
          </Item>

          <Item
            name="q4Answer"
            rules={[{ required: true, message: "请输入答案" }]}
          >
            <Input placeholder="请输入答案" size="large" />
          </Item>

          <Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              提交本题
            </Button>
          </Item>
        </Form>
      );
    }

    return null;
  };

  // final
  const renderFinal = () => {
    if (verificationPassed) {
      setTimeout(() => {
        onSuccess();
      }, 3000);
      return (
        <div className="success-card">
          <CheckCircleOutlined
            style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
          />
          <h3>验证成功！即将跳转...</h3>
        </div>
      );
    }

    return (
      <div className="success-card">
        <CloseCircleOutlined
          style={{ fontSize: 48, color: "#fa8c16", marginBottom: 16 }}
        />
        <h3>验证未通过</h3>
        <p>安全验证未通过，请稍后重试或联系管理员。</p>
        <Button onClick={() => navigate(-1)} size="large">
          返回
        </Button>
      </div>
    );
  };

  return (
    <div className="security-verification-container">
      <Card className="verification-card">
        <div className="verification-header">
          <div className="icon">
            <KeyOutlined />
          </div>
          <p>请完成安全验证以继续操作</p>
        </div>

        <div style={{ minHeight: 260 }}>
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>
            {phase === 0 && "身份确认"}
            {phase === 1 && `安全验证 · 第 ${Math.min(currentIndex + 1, 4)} 题`}
          </h3>

          {phase === 0 && (
            <Form form={form} onFinish={handleUsernameSubmit} layout="vertical">
              <Item name="username" label="用户名" rules={[{ required: true }]}>
                <Input
                  prefix={<LockOutlined />}
                  placeholder="请输入用户名"
                  size="large"
                />
              </Item>
              <Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                >
                  确认身份
                </Button>
              </Item>
            </Form>
          )}

          {phase === 1 && renderCurrentQuestion()}

          {phase === 2 && renderFinal()}
        </div>

        <div className="progress-info">
          <div className="title">验证说明：</div>
          <div>
            • 题目顺序：随机 Q1/Q2 → Q3（题库选题）→ 另一 Q1/Q2 → Q4（自定义）
          </div>
          <div>
            • 累计答对 ≥ 3 即通过；累计答错 ≥ 2 即失败（遇到任一情况即停止）
          </div>
        </div>

        <div className="step-actions">
          {phase !== 2 && (
            <Button onClick={() => navigate(-1)} size="large">
              取消
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default UserSecurity;
