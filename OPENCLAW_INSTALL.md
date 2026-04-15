# Soke AI Skills - OpenClaw 安装指南

本项目现已完全适配 OpenClaw（小龙虾）标准，可直接安装使用。

## 📦 包含的技能

### 1. soke-ai-exam-skill
AI智能出题考试系统 - 基于文档自动生成考试、指派学员并查询结果

### 2. soke-ai-report-skill  
员工学习进度分析系统 - 查询学习档案、分析进度并提供改进建议

## 🚀 安装到 OpenClaw

### 方式一：直接安装（推荐）

```bash
# 进入 OpenClaw 技能目录
cd ~/.openclaw/skills

# 克隆或复制本项目
git clone <repository-url> soke-ai-skills

# 或者直接复制两个技能目录
cp -r /path/to/soke-ai-skills/soke-ai-exam-skill ./
cp -r /path/to/soke-ai-skills/soke-ai-report-skill ./

# 安装依赖
cd soke-ai-exam-skill && npm install
cd ../soke-ai-report-skill && npm install
```

### 方式二：符号链接

```bash
# 创建符号链接
ln -s /path/to/soke-ai-skills/soke-ai-exam-skill ~/.openclaw/skills/
ln -s /path/to/soke-ai-skills/soke-ai-report-skill ~/.openclaw/skills/
```

## ⚙️ 配置环境变量

在 OpenClaw 配置文件或项目根目录创建 `.env` 文件：

```bash
BASE_URL=https://opendev.soke.cn
APP_KEY=your_app_key
APP_SECRET=your_app_secret
CORP_ID=your_corp_id
DEPT_USER_ID=your_dept_user_id
```

## 📖 使用示例

### 考试系统

```javascript
// 通过 OpenClaw 调用
const result = await openclaw.execute('soke-ai-exam', {
  action: 'createAndAssignExam',
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

### 学习分析系统

```javascript
// 查询用户学习进度
const result = await openclaw.execute('soke-ai-report', {
  userName: '张三'
});

// 查询部门学习情况
const result = await openclaw.execute('soke-ai-report', {
  deptName: '技术部'
});

// 查询新员工
const result = await openclaw.execute('soke-ai-report', {
  isNewEmployee: true
});
```

## 🔧 技能配置说明

每个技能都包含标准的 `skill.json` 配置文件，定义了：

- 技能名称和描述
- 工具列表和参数
- 依赖项
- 环境变量要求

## ✅ OpenClaw 标准兼容性

- ✅ 标准 `skill.json` 配置文件
- ✅ ES Module 格式
- ✅ 标准 `execute` 函数导出
- ✅ 完整的工具描述和参数定义
- ✅ 环境变量自动加载
- ✅ 错误处理和日志输出

## 📝 更新日志

### v1.0.0 (2026-04-15)
- ✅ 完成 OpenClaw 标准适配
- ✅ 添加 skill.json 配置文件
- ✅ 统一使用 ES Module
- ✅ 添加标准 execute 函数
- ✅ 完善工具描述和参数定义

## 🐛 故障排查

如果遇到问题，请检查：

1. 环境变量是否正确配置
2. 依赖是否已安装 (`npm install`)
3. Node.js 版本是否 >= 14
4. OpenClaw 是否正确识别技能

## 📮 技术支持

如有问题请提交 Issue 或联系项目维护者。
