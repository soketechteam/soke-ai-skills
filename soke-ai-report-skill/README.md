---
name: soke-learning-report-skill
description: 员工学习进度分析系统 - 查询学习档案、分析进度并提供改进建议
version: 1.0.0
author: AI Assistant
tags: [learning, education, analytics, openclaw]
---

# 员工学习进度分析系统

基于教育平台 API 实现的学习进度查询和分析系统。支持按用户名、部门名查询学习档案，自动分析学习完成率和考试通过率，并提供个性化改进建议。

## 功能特性

- 👤 用户查询 - 按用户名查询个人学习进度
- 🏢 部门查询 - 按部门名查询团队学习情况
- 🆕 新员工筛选 - 专门查询新员工学习状态
- 📊 智能分析 - 自动计算完成率、通过率并评级
- 💡 改进建议 - 根据学习情况提供针对性建议
- 📈 统计汇总 - 生成团队学习统计报告

## 配置

### 环境变量配置

创建 `.env` 文件：

```bash
BASE_URL=https://opendev.soke.cn
APP_KEY=your_app_key
APP_SECRET=your_app_secret
CORP_ID=your_corp_id
```

## 使用方法

### 1. 查询特定用户学习进度

```javascript
const skill = require('./learning_report.js');

const result = await skill.execute({
  userName: '张三'
});

console.log('用户姓名:', result.details[0].name);
console.log('所属部门:', result.details[0].department);
console.log('必修课完成率:', result.details[0].analysis.requiredCompletionRate + '%');
console.log('考试通过率:', result.details[0].analysis.examPassRate + '%');
console.log('评级:', result.details[0].analysis.level);
console.log('建议:', result.details[0].analysis.evaluation);
```

### 2. 查询部门学习情况

```javascript
const result = await skill.execute({
  deptName: '技术部'
});

console.log('部门总人数:', result.summary.totalUsers);
console.log('平均必修课完成率:', result.summary.avgRequiredCompletion);
console.log('平均考试通过率:', result.summary.avgExamPass);
console.log('优秀人数:', result.summary.excellentCount);
console.log('良好人数:', result.summary.goodCount);
console.log('待改进人数:', result.summary.needImproveCount);
```

### 3. 查询所有新员工

```javascript
const result = await skill.execute({
  isNew: '1'
});

// 筛选出学习进度滞后的新员工
const needAttention = result.details.filter(
  user => user.analysis.level === '待改进'
);

console.log(`共有 ${needAttention.length} 名新员工需要重点关注`);
needAttention.forEach(user => {
  console.log(`${user.name} (${user.department}): ${user.analysis.evaluation}`);
});
```

### 4. 查询部门新员工

```javascript
const result = await skill.execute({
  deptName: '技术部',
  isNew: '1'
});

console.log(`技术部新员工: ${result.summary.totalUsers} 人`);
console.log(`平均完成率: ${result.summary.avgRequiredCompletion}`);
```

### 5. 查询所有学员

```javascript
const result = await skill.execute({});

console.log('全公司学习情况统计:');
console.log('总人数:', result.summary.totalUsers);
console.log('平均必修课完成率:', result.summary.avgRequiredCompletion);
console.log('平均考试通过率:', result.summary.avgExamPass);
```

## API 参考

### 参数说明

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `userName` | string | 否 | 用户名（支持模糊查询） |
| `deptName` | string | 否 | 部门名称（支持模糊查询） |
| `isNew` | string | 否 | 是否只查询新员工（'1'=是，'0'=否） |

### 返回数据结构

#### 成功响应

```javascript
{
  success: true,
  summary: {
    totalUsers: number,              // 总人数
    avgRequiredCompletion: string,   // 平均必修课完成率
    avgExamPass: string,             // 平均考试通过率
    excellentCount: number,          // 优秀人数
    goodCount: number,               // 良好人数
    averageCount: number,            // 一般人数
    needImproveCount: number         // 待改进人数
  },
  details: [
    {
      name: string,                  // 姓名
      userId: string,                // 用户ID
      department: string,            // 部门
      position: string,              // 职位
      isNew: string,                 // 是否新员工
      hireDate: string,              // 入职日期
      stats: {
        assignedCourses: string,     // 指派课程数
        completedRequired: string,   // 完成必修课数
        completedElective: string,   // 完成选修课数
        enrolledElective: string,    // 报名选修课数
        passedExams: string,         // 通过考试数
        failedExams: string          // 未通过考试数
      },
      analysis: {
        requiredCompletionRate: string,  // 必修课完成率
        electiveCompletionRate: string,  // 选修课完成率
        examPassRate: string,            // 考试通过率
        level: string,                   // 评级
        evaluation: string               // 评价建议
      }
    }
  ]
}
```

#### 错误响应

```javascript
{
  error: string  // 错误信息
}
```

### 评级标准

| 评级 | 条件 | 说明 |
|------|------|------|
| **优秀** | 必修课完成率 ≥ 80% 且 考试通过率 ≥ 80% | 学习态度积极，完成度高，考试通过率优秀 |
| **良好** | 必修课完成率 ≥ 60% 且 考试通过率 ≥ 60% | 学习进度正常，但仍有提升空间 |
| **一般** | 必修课完成率 ≥ 40% | 学习进度偏慢，需要加快完成速度 |
| **待改进** | 必修课完成率 < 40% | 学习进度严重滞后，需要尽快完成 |

## 使用场景

### 场景1: HR 查看新员工培训进度

```javascript
// 查询所有新员工的学习情况
const result = await skill.execute({ isNew: '1' });

// 生成新员工培训报告
console.log('=== 新员工培训进度报告 ===');
console.log(`总人数: ${result.summary.totalUsers}`);
console.log(`平均完成率: ${result.summary.avgRequiredCompletion}`);
console.log(`需要关注: ${result.summary.needImproveCount} 人`);

// 列出需要重点关注的新员工
const needAttention = result.details.filter(
  user => user.analysis.level === '待改进'
);
console.log('\n需要重点关注的新员工:');
needAttention.forEach(user => {
  console.log(`- ${user.name} (${user.department})`);
  console.log(`  完成率: ${user.analysis.requiredCompletionRate}%`);
  console.log(`  建议: ${user.analysis.evaluation}\n`);
});
```

### 场景2: 部门经理查看团队学习情况

```javascript
// 查询技术部学习情况
const result = await skill.execute({ deptName: '技术部' });

console.log('=== 技术部学习情况 ===');
console.log(`团队人数: ${result.summary.totalUsers}`);
console.log(`平均必修课完成率: ${result.summary.avgRequiredCompletion}`);
console.log(`平均考试通过率: ${result.summary.avgExamPass}`);
console.log(`优秀: ${result.summary.excellentCount} 人`);
console.log(`良好: ${result.summary.goodCount} 人`);
console.log(`待改进: ${result.summary.needImproveCount} 人`);

// 表扬优秀学员
const excellent = result.details.filter(
  user => user.analysis.level === '优秀'
);
console.log('\n优秀学员:');
excellent.forEach(user => {
  console.log(`- ${user.name}: 必修课 ${user.analysis.requiredCompletionRate}%, 考试 ${user.analysis.examPassRate}%`);
});
```

### 场景3: 个人学习进度查询

```javascript
// 查询个人学习进度
const result = await skill.execute({ userName: '张三' });

if (result.error) {
  console.log('查询失败:', result.error);
} else {
  const user = result.details[0];
  console.log('=== 个人学习档案 ===');
  console.log(`姓名: ${user.name}`);
  console.log(`部门: ${user.department}`);
  console.log(`职位: ${user.position}`);
  console.log(`\n学习统计:`);
  console.log(`- 指派课程: ${user.stats.assignedCourses} 门`);
  console.log(`- 完成必修: ${user.stats.completedRequired} 门`);
  console.log(`- 完成选修: ${user.stats.completedElective} 门`);
  console.log(`- 通过考试: ${user.stats.passedExams} 次`);
  console.log(`\n学习分析:`);
  console.log(`- 必修课完成率: ${user.analysis.requiredCompletionRate}%`);
  console.log(`- 考试通过率: ${user.analysis.examPassRate}%`);
  console.log(`- 综合评级: ${user.analysis.level}`);
  console.log(`- 改进建议: ${user.analysis.evaluation}`);
}
```

### 场景4: 生成全公司学习报告

```javascript
// 查询所有学员
const result = await skill.execute({});

console.log('=== 全公司学习情况报告 ===');
console.log(`统计时间: ${new Date().toLocaleDateString()}`);
console.log(`\n总体情况:`);
console.log(`- 总人数: ${result.summary.totalUsers}`);
console.log(`- 平均必修课完成率: ${result.summary.avgRequiredCompletion}`);
console.log(`- 平均考试通过率: ${result.summary.avgExamPass}`);

console.log(`\n评级分布:`);
console.log(`- 优秀: ${result.summary.excellentCount} 人 (${(result.summary.excellentCount / result.summary.totalUsers * 100).toFixed(1)}%)`);
console.log(`- 良好: ${result.summary.goodCount} 人 (${(result.summary.goodCount / result.summary.totalUsers * 100).toFixed(1)}%)`);
console.log(`- 一般: ${result.summary.averageCount} 人 (${(result.summary.averageCount / result.summary.totalUsers * 100).toFixed(1)}%)`);
console.log(`- 待改进: ${result.summary.needImproveCount} 人 (${(result.summary.needImproveCount / result.summary.totalUsers * 100).toFixed(1)}%)`);

// 按部门统计
const deptStats = {};
result.details.forEach(user => {
  if (!deptStats[user.department]) {
    deptStats[user.department] = { total: 0, excellent: 0 };
  }
  deptStats[user.department].total++;
  if (user.analysis.level === '优秀') {
    deptStats[user.department].excellent++;
  }
});

console.log(`\n各部门优秀率:`);
Object.entries(deptStats).forEach(([dept, stats]) => {
  const rate = (stats.excellent / stats.total * 100).toFixed(1);
  console.log(`- ${dept}: ${rate}% (${stats.excellent}/${stats.total})`);
});
```

## 错误处理

```javascript
const result = await skill.execute({ userName: '张三' });

if (result.error) {
  console.error('查询失败:', result.error);

  // 根据错误类型进行处理
  if (result.error.includes('环境变量')) {
    console.error('请检查 .env 配置文件');
  } else if (result.error.includes('未找到')) {
    console.error('用户或部门不存在');
  } else if (result.error.includes('access_token')) {
    console.error('认证失败，请检查 APP_KEY 和 APP_SECRET');
  }
} else {
  console.log('查询成功:', result);
}
```

## 注意事项

1. **环境变量**: 必须配置 `APP_KEY`、`APP_SECRET`、`CORP_ID`
2. **Token管理**: access_token 会自动获取和管理
3. **查询逻辑**: 用户名和部门名支持模糊匹配
4. **数据时效**: 学习档案数据可能存在延迟
5. **性能考虑**: 查询所有学员时数据量较大，建议按需查询

## 项目结构

```
soke-ai-report-skill/
├── learning_report.js    # 主程序（Skill实现）
├── test.js              # 测试脚本
├── package.json         # 项目配置
├── README.md            # 使用说明
├── SKILL.md             # Skill文档
├── .env.example         # 环境变量示例
└── .gitignore           # Git忽略配置
```

## 依赖项

- Node.js 内置模块:
  - `https` - HTTPS 请求
  - `url` - URL 解析

无需安装额外依赖包。

## 版本历史

### v1.0.0 (2026-04-15)
- ✨ 初始版本发布
- ✅ 支持用户名查询
- ✅ 支持部门名查询
- ✅ 支持新员工筛选
- ✅ 智能学习分析
- ✅ 统计汇总报告

## 许可证

MIT

## 支持

如有问题或建议，请提交 Issue 或 Pull Request。
