---
name: soke-ai-skills
description: Soke AI Skills Collection - 智能考试系统和学习进度分析工具集
version: 1.0.0
author: AI Assistant
tags: [ai, exam, learning, education, openclaw]
---

# Soke AI Skills Collection

基于 Soke 教育平台 API 的智能技能工具集，包含考试管理和学习分析两大核心功能。

## 📦 技能列表

### 1. AI 智能出题考试系统 (`soke-ai-exam-skill`)

基于文档自动生成考试、指派学员并查询结果的智能系统。

**功能特性:**
- 🤖 AI智能出题 - 上传文档自动生成试题
- 📝 多种题型支持 - 单选、多选、不定项、判断、填空、简答
- 👥 灵活指派 - 支持按用户名和部门名指派
- 📊 结果查询 - 单个和批量查询学员考试结果

**详细文档:** [soke-ai-exam-skill/README.md](./soke-ai-exam-skill/README.md)

### 2. 员工学习进度分析系统 (`soke-ai-report-skill`)

查询学习档案、分析进度并提供改进建议的分析系统。

**功能特性:**
- 👤 用户查询 - 按用户名查询个人学习进度
- 🏢 部门查询 - 按部门名查询团队学习情况
- 🆕 新员工筛选 - 专门查询新员工学习状态
- 📊 智能分析 - 自动计算完成率、通过率并评级

**详细文档:** [soke-ai-report-skill/README.md](./soke-ai-report-skill/README.md)

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 配置环境变量

在项目根目录创建 `.env` 文件：

```bash
BASE_URL=https://opendev.soke.cn
APP_KEY=your_app_key
APP_SECRET=your_app_secret
CORP_ID=your_corp_id
DEPT_USER_ID=your_dept_user_id
```

### 使用示例

#### 考试系统

```javascript
import aiExamSkill from './soke-ai-exam-skill/index.js';

// 初始化
await aiExamSkill.initialize(appKey, appSecret, corpId);

// 创建考试并指派
const result = await aiExamSkill.createAndAssignExam({
  filePath: '/path/to/document.pdf',
  examTitle: '2026年春季期末考试',
  questionTypes: [
    { type: 'danxuan', count: 10 },
    { type: 'duoxuan', count: 5 }
  ],
  creatorUserId: 'user_id',
  creatorUserName: '张老师',
  assignUserNames: ['李明', '王芳']
});
```

#### 学习分析系统

```javascript
const skill = require('./soke-ai-report-skill/learning_report.js');

// 查询用户学习进度
const result = await skill.execute({
  userName: '张三'
});

console.log('必修课完成率:', result.details[0].analysis.requiredCompletionRate);
console.log('评级:', result.details[0].analysis.level);
```

## 📁 项目结构

```
soke-ai-skills/
├── .env                          # 统一环境变量配置
├── .env.example                  # 环境变量示例
├── package.json                  # 统一依赖管理
├── SKILL.md                      # 本文件 - 技能集总览
├── soke-ai-exam-skill/          # 考试系统
│   ├── index.js                 # 主入口
│   ├── config.js                # 配置管理
│   ├── api-client.js            # API客户端
│   ├── services.js              # 部门和用户服务
│   ├── exam-service.js          # 考试核心服务
│   ├── package.json             # 子项目配置
│   └── README.md                # 详细文档
└── soke-ai-report-skill/        # 学习分析系统
    ├── learning_report.js       # 主程序
    ├── test.js                  # 测试脚本
    ├── package.json             # 子项目配置
    └── README.md                # 详细文档
```

## 🔧 技术栈

- **Node.js** - 运行环境
- **axios** - HTTP 客户端
- **dotenv** - 环境变量管理
- **form-data** - 文件上传支持

## 📋 API 配置说明

### 环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `BASE_URL` | API 基础地址 | `https://opendev.soke.cn` |
| `APP_KEY` | 应用密钥 | `soke426c576c...` |
| `APP_SECRET` | 应用密钥 | `2189595a7a0c...` |
| `CORP_ID` | 企业ID | `dingc4cffb65...` |
| `DEPT_USER_ID` | 部门用户ID | `manager5600` |

### 获取凭证

1. 登录 Soke 教育平台管理后台
2. 进入「开发者中心」
3. 创建应用获取 `APP_KEY` 和 `APP_SECRET`
4. 在「企业信息」中获取 `CORP_ID`

## 🎯 使用场景

### 考试系统适用场景

- 📚 在线培训考核
- 🎓 员工入职测试
- 📝 定期知识考核
- 🏆 技能认证考试

### 学习分析系统适用场景

- 📊 员工学习进度跟踪
- 🎯 新员工培训监控
- 📈 部门学习情况统计
- 💡 学习效果评估

## 🔐 安全说明

1. **环境变量保护**: `.env` 文件已加入 `.gitignore`，不会提交到版本控制
2. **凭证管理**: 请妥善保管 `APP_KEY` 和 `APP_SECRET`
3. **Token 缓存**: access_token 自动管理，无需手动刷新

## 📝 开发指南

### 添加新技能

1. 在根目录创建新的技能目录：
   ```bash
   mkdir soke-ai-new-skill
   ```

2. 在新目录中创建 `package.json`：
   ```json
   {
     "name": "soke-ai-new-skill",
     "version": "1.0.0",
     "description": "New skill description",
     "main": "index.js"
   }
   ```

3. 更新根目录 `package.json` 的 workspaces：
   ```json
   "workspaces": [
     "soke-ai-exam-skill",
     "soke-ai-report-skill",
     "soke-ai-new-skill"
   ]
   ```

4. 在新技能中使用统一的环境变量：
   ```javascript
   import dotenv from 'dotenv';
   import path from 'path';
   dotenv.config({ path: path.resolve(__dirname, '../.env') });
   ```

5. 更新本文件，添加新技能的说明

### 代码规范

- 使用 ES6+ 语法
- 统一错误处理
- 添加详细注释
- 编写单元测试

## 🐛 故障排查

### 常见问题

**1. 环境变量未生效**
```bash
# 检查 .env 文件是否存在
ls -la .env

# 检查环境变量是否正确加载
node -e "require('dotenv').config(); console.log(process.env.APP_KEY)"
```

**2. 依赖安装失败**
```bash
# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

**3. API 调用失败**
- 检查网络连接
- 验证 APP_KEY 和 APP_SECRET 是否正确
- 确认 access_token 是否过期

## 📄 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件至项目维护者

## 🔄 版本历史

### v1.0.0 (2026-04-15)
- ✨ 初始版本发布
- ✅ AI 智能出题考试系统
- ✅ 员工学习进度分析系统
- ✅ 统一环境变量配置
- ✅ 统一依赖管理
