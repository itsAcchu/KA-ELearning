import TeacherContent from '../models/TeacherContent.js';
import User from '../models/User.js';

/* --------------------------------------------------------
   1. Get Teacher Status
---------------------------------------------------------*/
export const getTeacherStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      teacherMode: user.teacherMode || false,
      stats: user.teacherStats || {
        studentsHelped: 0,
        contentCreated: 0,
        coinsEarned: 0,
        rating: 0,
        verified: false
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------------
   2. Unlock Teacher Mode
---------------------------------------------------------*/
export const unlockTeacherMode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const level = user.level || 0;
    const accuracy = user.stats?.accuracy || 0;

    // Criteria: Level 5+ OR Accuracy 85%+
    if (level >= 5 || accuracy >= 85) {
      user.teacherMode = true;

      if (!user.teacherStats) {
        user.teacherStats = {
          studentsHelped: 0,
          contentCreated: 0,
          coinsEarned: 0,
          rating: 0,
          verified: false
        };
      }

      await user.save();

      return res.json({
        success: true,
        message: 'Teacher mode unlocked! 🎉'
      });
    }

    return res.status(403).json({
      success: false,
      message: `Requirements not met. Current level: ${level}, accuracy: ${accuracy}%. Need level 5+ or 85%+ accuracy.`
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------------
   3. Create Teacher Content
---------------------------------------------------------*/
export const createContent = async (req, res) => {
  try {
    const { title, description, type, difficulty, content } = req.body;

    const teacherContent = new TeacherContent({
      teacherId: req.user._id,
      title,
      description,
      type,
      difficulty: difficulty || 3,
      content,
      status: 'published'
    });

    await teacherContent.save();

    // Update teacher stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'teacherStats.contentCreated': 1 }
    });

    res.json({
      success: true,
      content: teacherContent
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------------
   4. Get Published Content
---------------------------------------------------------*/
export const getContent = async (req, res) => {
  try {
    const content = await TeacherContent.find({ status: 'published' })
      .populate('teacherId', 'username teacherStats')
      .sort('-rating')
      .limit(50);

    res.json({
      success: true,
      content
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------------
   5. Earn Coins from Student Engagement
---------------------------------------------------------*/
export const earnFromContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await TeacherContent.findById(contentId);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    // Prevent teacher from earning coins from themselves
    if (String(content.teacherId) === String(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot earn coins from your own content.'
      });
    }

    // Prevent double-counting the same learner
    if (content.learners.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'You already helped this content once.'
      });
    }

    const coins = 5; // Coin reward per learner

    content.coinsEarned += coins;
    content.learners.push(req.user._id);
    await content.save();

    await User.findByIdAndUpdate(content.teacherId, {
      $inc: {
        'coins': coins,
        'teacherStats.coinsEarned': coins,
        'teacherStats.studentsHelped': 1
      }
    });

    res.json({
      success: true,
      coinsEarned: coins
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* --------------------------------------------------------
   6. Teacher Leaderboard
---------------------------------------------------------*/
export const getTeacherLeaderboard = async (req, res) => {
  try {
    const teachers = await User.find({ teacherMode: true })
      .sort('-teacherStats.coinsEarned')
      .limit(10)
      .select('username teacherStats');

    res.json({
      success: true,
      teachers
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
