/**
 * Learning Progress Analyzer Skill
 * 根据用户名或部门名查询员工学习进度并进行分析点评
 */

const https = require('https');
const url = require('url');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// 配置信息 - 从环境变量读取
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'https://opendev.soke.cn',
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  corpId: process.env.CORP_ID
};

// HTTP 请求封装
function makeRequest(urlString, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(urlString);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

// 1. 获取 access_token
async function getAccessToken() {
  const urlString = `${CONFIG.baseUrl}/service/corp/gettoken?app_key=${CONFIG.appKey}&app_secret=${CONFIG.appSecret}&corpid=${CONFIG.corpId}`;
  const response = await makeRequest(urlString, 'GET');

  if (response.code === '200' && response.data) {
    return response.data;
  }
  throw new Error('Failed to get access token: ' + response.message);
}

// 2. 通过部门名称查询部门ID
async function searchDepartmentByName(accessToken, deptName) {
  const urlString = `${CONFIG.baseUrl}/oa/department/searchDepartmentByName?access_token=${accessToken}`;
  const response = await makeRequest(urlString, 'POST', { dept_name: deptName });

  if (response.code === '200' && response.data) {
    return response.data.list || [];
  }
  throw new Error('Failed to search department: ' + response.message);
}

// 3. 通过用户名查询用户ID
async function searchUserByName(accessToken, userName) {
  const urlString = `${CONFIG.baseUrl}/oa/departmentUser/searchDepartmentUserByName?access_token=${accessToken}&page_size=100&dept_user_name=${encodeURIComponent(userName)}`;
  const response = await makeRequest(urlString, 'POST', {
    access_token: accessToken,
    page_size: '100',
    dept_user_name: userName
  });

  if (response.code === '200' && response.data) {
    return response.data.list || [];
  }
  throw new Error('Failed to search user: ' + response.message);
}

// 4. 查询学员学习档案
async function getLearningProfiles(accessToken, userIds, isNew = null) {
  const params = {
    center: 'soke'  // 根据接口文档，center参数使用soke作为默认值
  };

  // 如果传了 userIds，则添加到参数中
  if (userIds && userIds.length > 0) {
    params.dept_user_ids = userIds;
  }

  // 如果传了 isNew，则添加到参数中
  if (isNew!== null && isNew!== undefined && isNew!== '') {
    params.is_new = isNew;
  }

  const urlString = `${CONFIG.baseUrl}/dataCenter/learningProfile/list?offset=0&page_size=100&access_token=${accessToken}`;
  const response = await makeRequest(urlString, 'POST', params);

  if (response.code === '200' && response.data) {
    return response.data;
  }
  throw new Error('Failed to get learning profiles: ' + response.message);
}

// 分析学习进度
function analyzeLearningProgress(profile) {
  const assigned = parseInt(profile.assigned_required_courses) || 0;
  const completedRequired = parseInt(profile.completed_required_courses) || 0;
  const completedElective = parseInt(profile.completed_elective_courses) || 0;
  const enrolledElective = parseInt(profile.enrolled_elective_courses) || 0;
  const passedExams = parseInt(profile.passed_exams) || 0;
  const failedExams = parseInt(profile.failed_exams) || 0;
  const gradedExams = parseInt(profile.graded_exams) || 0;

  const requiredCompletionRate = assigned > 0? (completedRequired / assigned * 100).toFixed(2) : '0.00';
  const electiveCompletionRate = enrolledElective > 0? (completedElective / enrolledElective * 100).toFixed(2) : '0.00';
  const examPassRate = gradedExams > 0? (passedExams / gradedExams * 100).toFixed(2) : '0.00';

  let evaluation = '';
  let level = '';

  // 综合评价逻辑
  if (requiredCompletionRate >= 80 && examPassRate >= 80) {
    level = '优秀';
    evaluation = '学习态度积极，完成度高，考试通过率优秀，建议继续保持。';
  } else if (requiredCompletionRate >= 60 && examPassRate >= 60) {
    level = '良好';
    evaluation = '学习进度正常，但仍有提升空间，建议加强薄弱环节。';
  } else if (requiredCompletionRate >= 40) {
    level = '一般';
    evaluation = '学习进度偏慢，需要加快必修课程完成速度，提高学习效率。';
  } else {
    level = '待改进';
    evaluation = '学习进度严重滞后，建议尽快完成指派课程，必要时寻求辅导支持。';
  }

  return {
    requiredCompletionRate: requiredCompletionRate,
    electiveCompletionRate: electiveCompletionRate,
    examPassRate: examPassRate,
    level,
    evaluation
  };
}

// 格式化学习档案结果
function formatLearningProfiles(profiles) {
  const results = profiles.map(profile => {
    const analysis = analyzeLearningProgress(profile);
    return {
      name: profile.dept_user_name,
      userId: profile.dept_user_id,
      department: profile.dept_names,
      position: profile.position,
      isNew: profile.is_new === '1'? '是' : '否',
      hireDate: profile.hire_date || '未知',
      stats: {
        assignedCourses: profile.assigned_required_courses,
        completedRequired: profile.completed_required_courses,
        completedElective: profile.completed_elective_courses,
        enrolledElective: profile.enrolled_elective_courses,
        passedExams: profile.passed_exams,
        failedExams: profile.failed_exams
      },
      analysis
    };
  });

  // 统计汇总
  const totalStats = {
    totalUsers: results.length,
    avgRequiredCompletion: results.length > 0
     ? (results.reduce((sum, r) => sum + parseFloat(r.analysis.requiredCompletionRate), 0) / results.length).toFixed(2) + '%'
      : '0.00%',
    avgExamPass: results.length > 0
     ? (results.reduce((sum, r) => sum + parseFloat(r.analysis.examPassRate), 0) / results.length).toFixed(2) + '%'
      : '0.00%',
    excellentCount: results.filter(r => r.analysis.level === '优秀').length,
    goodCount: results.filter(r => r.analysis.level === '良好').length,
    averageCount: results.filter(r => r.analysis.level === '一般').length,
    needImproveCount: results.filter(r => r.analysis.level === '待改进').length
  };

  return {
    success: true,
    summary: totalStats,
    details: results
  };
}

// 主函数
async function main(args) {
  try {
    // 验证必需的环境变量
    if (!CONFIG.appKey || !CONFIG.appSecret || !CONFIG.corpId) {
      return {
        error: '缺少必需的环境变量。请设置：APP_KEY, APP_SECRET, CORP_ID'
      };
    }

    const { userName, deptName, isNew } = args;

    console.log('正在获取 access_token...');
    const accessToken = await getAccessToken();

    let profiles = [];

    // 场景1：只查询新员工（不限部门和人员）
    if (isNew === '1' &&!userName &&!deptName) {
      console.log('正在查询所有新员工...');
      profiles = await getLearningProfiles(accessToken, [], isNew);
      console.log(`找到 ${profiles.length} 个新员工`);
      return formatLearningProfiles(profiles);
    }

    // 场景2：按用户名查询
    if (userName) {
      console.log(`正在查询用户: ${userName}`);
      const users = await searchUserByName(accessToken, userName);

      if (users.length === 0) {
        return { error: '未找到匹配的用户' };
      }

      const userIds = users.map(u => u.dept_user_id);
      console.log(`找到 ${users.length} 个匹配用户`);

      try {
        profiles = await getLearningProfiles(accessToken, userIds, isNew);

        if (profiles.length === 0) {
          return {
            error: `找到用户 "${userName}"，但该用户暂无学习档案数据。可能原因：\n1. 该用户未被分配任何课程\n2. 该用户不在学习系统中\n3. 数据尚未同步`
          };
        }

        return formatLearningProfiles(profiles);
      } catch (error) {
        // 如果是51003错误，说明用户没有学习档案
        if (error.message.includes('51003') || error.message.includes('学员学习档案获取失败')) {
          return {
            error: `找到用户 "${userName}"，但该用户暂无学习档案数据。可能原因：\n1. 该用户未被分配任何课程\n2. 该用户不在学习系统中\n3. 数据尚未同步`
          };
        }
        throw error;
      }
    }

    // 场景3：按部门名查询
    if (deptName) {
      console.log(`正在查询部门: ${deptName}`);

      // 获取所有学习档案（可选择性筛选新员工）
      const allProfiles = await getLearningProfiles(accessToken, [], isNew);

      // 按部门名过滤（支持模糊匹配）
      profiles = allProfiles.filter(profile =>
        profile.dept_names && profile.dept_names.includes(deptName)
      );

      console.log(`找到 ${profiles.length} 个匹配部门的用户`);

      if (profiles.length === 0) {
        return { error: '未找到匹配部门的用户' };
      }

      return formatLearningProfiles(profiles);
    }

    // 如果没有提供任何查询条件，查询所有学员
    console.log('正在查询所有学员...');
    profiles = await getLearningProfiles(accessToken, [], isNew);
    console.log(`找到 ${profiles.length} 个学员`);
    
    if (profiles.length === 0) {
      return { error: '未找到任何学员数据' };
    }
    
    return formatLearningProfiles(profiles);

  } catch (error) {
    return { error: error.message };
  }
}

// OpenClaw Skill 导出
module.exports = {
  name: 'learning-report',
  description: '查询学员学习档案并进行分析点评',
  version: '1.0.0',
  parameters: {
    userName: {
      type:'string',
      description: '用户名（支持模糊查询）',
      required: false
    },
    deptName: {
      type:'string',
      description: '部门名称（支持模糊查询）',
      required: false
    },
    isNew: {
      type:'string',
      description: '是否只查询新员工（1=是，0=否）',
      required: false
    }
  },
  execute: main
};
