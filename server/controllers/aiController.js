const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate Quiz Feedback
const generateQuizFeedback = async (questions, evaluatedAnswers, percentage) => {
  try {
    const wrongAnswers = evaluatedAnswers
      .filter((a) => !a.isCorrect)
      .map((a) => {
        const question = questions.find(
          (q) => q._id.toString() === a.question.toString()
        );
        return {
          question: question?.text,
          correctAnswer: question?.answer,
          userAnswer: a.selectedAnswer,
          explanation: question?.explanation,
        };
      });

    const prompt = `
      A student completed a placement quiz and scored ${percentage}%.
      They got the following questions wrong:
      ${JSON.stringify(wrongAnswers, null, 2)}

      Please provide structured feedback in the following JSON format only:
      {
        "summary": "brief overall performance summary",
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
      }
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const feedback = JSON.parse(response.choices[0].message.content);
    return feedback;
  } catch (error) {
    console.error("AI Feedback Error:", error.message);
    return {
      summary: "Could not generate AI feedback at this time.",
      strengths: [],
      weaknesses: [],
      recommendations: [],
    };
  }
};

// @desc    Generate personalized roadmap
// @route   POST /api/ai/roadmap
// @access  Private
const generateRoadmap = async (req, res) => {
  try {
    const { weakTopics, targetCompany, timeframe } = req.body;

    const prompt = `
      Create a personalized placement preparation roadmap for a student with the following details:
      - Weak Topics: ${weakTopics.join(", ")}
      - Target Company Type: ${targetCompany}
      - Timeframe: ${timeframe} weeks

      Provide the response in the following JSON format only:
      {
        "title": "roadmap title",
        "weeks": [
          {
            "week": 1,
            "focus": "main focus area",
            "topics": ["topic1", "topic2"],
            "resources": ["resource1", "resource2"],
            "goals": ["goal1", "goal2"]
          }
        ],
        "tips": ["tip1", "tip2", "tip3"]
      }
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const roadmap = JSON.parse(response.choices[0].message.content);

    res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Analyze resume with AI
// @route   POST /api/ai/resume-analyze
// @access  Private
const analyzeResume = async (resumeText) => {
  try {
    const prompt = `
      Analyze the following resume text for a placement/job application:
      "${resumeText}"

      Provide feedback in the following JSON format only:
      {
        "aiScore": 75,
        "overallFeedback": "overall feedback summary",
        "suggestions": [
          { "category": "Formatting", "message": "suggestion message" },
          { "category": "Skills", "message": "suggestion message" }
        ],
        "keywords": {
          "found": ["keyword1", "keyword2"],
          "missing": ["keyword3", "keyword4"]
        },
        "sections": {
          "hasEducation": true,
          "hasExperience": false,
          "hasSkills": true,
          "hasProjects": true,
          "hasSummary": false
        }
      }
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Resume Analysis Error:", error.message);
    return null;
  }
};

// @desc    Mock Interview - Start session
// @route   POST /api/interview/start
// @access  Private
const startInterview = async (req, res) => {
  try {
    const { jobRole, difficulty } = req.body;

    const prompt = `
      You are an expert technical interviewer at a top tech company.
      Start a mock interview for a ${jobRole} position at ${difficulty} level.
      Ask the first interview question. Be professional and encouraging.
      Keep the question concise and clear.
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    });

    res.status(200).json({
      success: true,
      data: {
        message: response.choices[0].message.content,
        role: "interviewer",
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mock Interview - Continue session
// @route   POST /api/interview/answer
// @access  Private
const continueInterview = async (req, res) => {
  try {
    const { messages, userAnswer, questionNumber } = req.body;

    const conversationHistory = messages.map((m) => ({
      role: m.role === "interviewer" ? "assistant" : "user",
      content: m.content,
    }));

    conversationHistory.push({
      role: "user",
      content: userAnswer,
    });

    const systemPrompt = `
      You are an expert technical interviewer.
      Evaluate the candidate's answer, provide brief constructive feedback,
      and ask the next interview question (up to question ${questionNumber + 1} of 5).
      If this is question 5, provide a final evaluation summary with:
      - Overall rating (out of 10)
      - Key strengths
      - Areas to improve
      - Final recommendation
    `;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        message: response.choices[0].message.content,
        role: "interviewer",
        isComplete: questionNumber >= 5,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateQuizFeedback,
  generateRoadmap,
  analyzeResume,
  startInterview,
  continueInterview,
};