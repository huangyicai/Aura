export type Locale = 'en' | 'zh';

export const translations = {
  en: {
    // 通用
    common: {
      newChat: 'New Chat',
      settings: 'Settings',
      plugins: 'Plugins',
      skills: 'Skills',
      search: 'Search',
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      edit: 'Edit',
      copy: 'Copy',
      loading: 'Loading...',
      noResults: 'No results found',
      submit: 'Submit',
      clear: 'Clear',
      close: 'Close',
    },
    // 主题切换
    theme: {
      light: 'Light mode',
      dark: 'Dark mode',
      toggle: 'Toggle theme',
      aura: 'Aura Theme',
    },
    // 语言切换
    language: {
      en: 'English',
      zh: '中文',
      toggle: 'Switch language',
    },
    // 聊天相关
    chat: {
      sendMessage: 'Send message',
      attachFile: 'Attach file',
      typeMessage: 'Type your message...',
      thinking: 'Thinking...',
      error: 'Something went wrong',
      retry: 'Retry',
      regenerate: 'Regenerate',
      copyCode: 'Copy code',
      copied: 'Copied!',
    },
    // 设置
    settings: {
      title: 'Settings',
      general: 'General',
      appearance: 'Appearance',
      api: 'API Configuration',
      providers: 'API Providers',
      addProvider: 'Add Provider',
      editProvider: 'Edit Provider',
      providerName: 'Provider Name',
      providerType: 'Provider Type',
      baseUrl: 'Base URL',
      apiKey: 'API Key',
      isActive: 'Active',
      notes: 'Notes',
      deleteProvider: 'Delete Provider',
      activateProvider: 'Activate Provider',
    },
    // 侧边栏
    sidebar: {
      history: 'History',
      today: 'Today',
      yesterday: 'Yesterday',
      lastWeek: 'Last 7 Days',
      older: 'Older',
      archived: 'Archived',
      importSession: 'Import Session',
      exportSession: 'Export Session',
    },
    // 项目面板
    project: {
      title: 'Project',
      tasks: 'Tasks',
      files: 'Files',
      noTasks: 'No tasks yet',
      addTask: 'Add Task',
      taskStatus: {
        pending: 'Pending',
        inProgress: 'In Progress',
        completed: 'Completed',
        failed: 'Failed',
      },
    },
    // 插件
    plugins: {
      title: 'Plugins',
      mcpServers: 'MCP Servers',
      addServer: 'Add Server',
      configure: 'Configure',
      enabled: 'Enabled',
      disabled: 'Disabled',
    },
    // 技能
    skills: {
      title: 'Skills',
      createSkill: 'Create Skill',
      editSkill: 'Edit Skill',
      deleteSkill: 'Delete Skill',
      skillName: 'Skill Name',
      description: 'Description',
    },
    // 对话框
    dialog: {
      deleteConfirm: 'Are you sure you want to delete this item?',
      unsavedChanges: 'You have unsaved changes. Are you sure you want to close?',
    },
  },
  zh: {
    // 通用
    common: {
      newChat: '新建对话',
      settings: '设置',
      plugins: '插件',
      skills: '技能',
      search: '搜索',
      delete: '删除',
      cancel: '取消',
      confirm: '确认',
      save: '保存',
      edit: '编辑',
      copy: '复制',
      loading: '加载中...',
      noResults: '未找到结果',
      submit: '提交',
      clear: '清空',
      close: '关闭',
    },
    // 主题切换
    theme: {
      light: '浅色模式',
      dark: '深色模式',
      toggle: '切换主题',
      aura: 'Aura 主题',
    },
    // 语言切换
    language: {
      en: 'English',
      zh: '中文',
      toggle: '切换语言',
    },
    // 聊天相关
    chat: {
      sendMessage: '发送消息',
      attachFile: '附加文件',
      typeMessage: '输入您的消息...',
      thinking: '思考中...',
      error: '出错了',
      retry: '重试',
      regenerate: '重新生成',
      copyCode: '复制代码',
      copied: '已复制！',
    },
    // 设置
    settings: {
      title: '设置',
      general: '通用',
      appearance: '外观',
      api: 'API 配置',
      providers: 'API 提供商',
      addProvider: '添加提供商',
      editProvider: '编辑提供商',
      providerName: '提供商名称',
      providerType: '提供商类型',
      baseUrl: '基础 URL',
      apiKey: 'API 密钥',
      isActive: '已激活',
      notes: '备注',
      deleteProvider: '删除提供商',
      activateProvider: '激活提供商',
    },
    // 侧边栏
    sidebar: {
      history: '历史记录',
      today: '今天',
      yesterday: '昨天',
      lastWeek: '最近 7 天',
      older: '更早',
      archived: '已归档',
      importSession: '导入会话',
      exportSession: '导出会话',
    },
    // 项目面板
    project: {
      title: '项目',
      tasks: '任务',
      files: '文件',
      noTasks: '暂无任务',
      addTask: '添加任务',
      taskStatus: {
        pending: '待处理',
        inProgress: '进行中',
        completed: '已完成',
        failed: '失败',
      },
    },
    // 插件
    plugins: {
      title: '插件',
      mcpServers: 'MCP 服务器',
      addServer: '添加服务器',
      configure: '配置',
      enabled: '已启用',
      disabled: '已禁用',
    },
    // 技能
    skills: {
      title: '技能',
      createSkill: '创建技能',
      editSkill: '编辑技能',
      deleteSkill: '删除技能',
      skillName: '技能名称',
      description: '描述',
    },
    // 对话框
    dialog: {
      deleteConfirm: '确定要删除此项目吗？',
      unsavedChanges: '您有未保存的更改。确定要关闭吗？',
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
export type NestedTranslationKey<T> = T extends object
  ? { [K in keyof T]: NestedTranslationKey<T[K]> }
  : T;
