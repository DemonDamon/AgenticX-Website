'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Github,
  ArrowRight,
  Cpu,
  Layers,
  Database,
  Activity,
  MessageSquare,
  Terminal,
  Menu,
  X,
  Check
} from 'lucide-react';

// 打字机效果 Hook (循环)
function useTypewriter(text: string, speed: number = 50, delay: number = 0, pauseDuration: number = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let i = 0;
    let timeout: NodeJS.Timeout;
    
    const startTyping = () => {
      if (isDeleting) {
        // 删除过程
        timeout = setTimeout(() => {
          if (i > 0) {
            setDisplayText(text.slice(0, i - 1));
            i--;
          } else {
            setIsDeleting(false);
            setTimeout(() => {}, delay);
          }
        }, speed / 2);
      } else {
        // 打字过程
        timeout = setTimeout(() => {
          if (i < text.length) {
            setDisplayText(text.slice(0, i + 1));
            i++;
          } else {
            // 打完后暂停，然后开始删除
            setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
          }
        }, speed);
      }
    };

    const timer = setInterval(startTyping, 1);
    startTyping(); // 立即开始

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [text, speed, delay, pauseDuration, isDeleting]);

  return displayText;
}

// 渐变边框动画组件
function GradientBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      {/* 渐变背景 */}
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
      {/* 内容 */}
      <div className="relative bg-neutral-950 rounded-xl">
        {children}
      </div>
    </div>
  );
}

// 步骤展开组件 (循环)
function StepDemo() {
  const [steps, setSteps] = useState<number[]>([]);
  
  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    
    const runAnimation = () => {
      setSteps([]); // 重置
      
      // 依次展开
      [1, 2, 3].forEach((step, i) => {
        timers.push(setTimeout(() => {
          setSteps(prev => [...prev, step]);
        }, 500 + i * 800));
      });
      
      // 全部展开后重置循环
      timers.push(setTimeout(() => {
        runAnimation();
      }, 500 + 3 * 800 + 2000)); // 展开完成后暂停2秒
    };

    runAnimation();

    return () => timers.forEach(clearTimeout);
  }, []);

  const stepContent = [
    { title: 'Parse task', desc: 'Analyze user request and extract intent' },
    { title: 'Select tools', desc: 'Choose appropriate tools from registry' },
    { title: 'Execute & respond', desc: 'Run tools and format output' },
  ];

  return (
    <div className="bg-neutral-900 rounded-lg p-4 min-h-[120px]">
      <div className="space-y-3">
        {steps.map((step) => (
          <div 
            key={step}
            className="flex items-start gap-3 animate-fade-in"
          >
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Step {step}: {stepContent[step-1].title}</div>
              <div className="text-xs text-neutral-500">{stepContent[step-1].desc}</div>
            </div>
          </div>
        ))}
        {steps.length < 3 && (
          <div className="flex items-center gap-3 text-neutral-600">
            <div className="w-6 h-6 rounded-full border border-neutral-700 flex-shrink-0" />
            <div className="text-xs">Processing...</div>
          </div>
        )}
      </div>
    </div>
  );
}

// 打字机代码展示
function TypedCode() {
  const code = `agent = Agent(
  id="assistant",
  role="AI Assistant"
)
result = executor.run(task)`;
  
  const displayText = useTypewriter(code, 30, 300);

  return (
    <div className="bg-neutral-900 rounded-lg p-4 font-mono text-sm min-h-[120px]">
      <div className="text-neutral-300 whitespace-pre">{displayText}<span className="animate-blink">|</span></div>
    </div>
  );
}

// Memory 动画组件 (循环)
function MemoryDemo() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  
  useEffect(() => {
    let timers: NodeJS.Timeout[] = [];
    
    const runAnimation = () => {
      setVisibleItems([]); // 重置
      
      // 依次显示
      [0, 1, 2].forEach((i) => {
        timers.push(setTimeout(() => {
          setVisibleItems(prev => [...prev, i]);
        }, 200 + i * 400));
      });
      
      // 全部显示后重置循环
      timers.push(setTimeout(() => {
        runAnimation();
      }, 200 + 3 * 400 + 2000)); // 完成后暂停2秒
    };

    runAnimation();

    return () => timers.forEach(clearTimeout);
  }, []);

  const items = [
    { text: 'Session stored', color: 'bg-green-500' },
    { text: 'Context retrieved', color: 'bg-blue-500' },
    { text: 'Memory consolidated', color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-neutral-900 rounded-lg p-4 min-h-[120px] flex flex-col justify-center">
      <div className="space-y-2">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-2 transition-all duration-300 ${visibleItems.includes(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
          >
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <span className="text-xs text-neutral-400">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
      {children}
    </span>
  );
}

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('agent');

  const features = [
    {
      icon: <Cpu className="w-5 h-5" />,
      title: 'Agent Core',
      description: 'Production-ready execution engine with retry logic and error handling.',
      demo: <TypedCode />
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: 'Orchestration',
      description: 'Graph-based workflow with conditional routing and parallel execution.',
      demo: <StepDemo />
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: 'Memory System',
      description: 'Long-term memory with Mem0 integration, any LLM backend.',
      demo: <MemoryDemo />
    },
  ];

  const tabs = [
    { id: 'agent', label: 'Agent' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'tools', label: 'Tools' },
  ];

  const codeExamples = {
    agent: `from agenticx import Agent, Task, AgentExecutor
from agenticx.llms import OpenAIProvider

agent = Agent(
    id="research-agent",
    name="Research Assistant",
    role="Information gatherer",
    goal="Find and synthesize information"
)

task = Task(
    description="Research latest AI frameworks",
    expected_output="Comprehensive analysis"
)

executor = AgentExecutor(agent=agent, llm=OpenAIProvider())
result = executor.run(task)`,
    workflow: `from agenticx import Workflow, Node, Edge

workflow = Workflow(name="data-pipeline")

# Define nodes
extract = Node("extract", extractor_agent)
transform = Node("transform", transformer_agent)
load = Node("load", loader_agent)

# Connect nodes
workflow.add_edge(Edge(extract, transform))
workflow.add_edge(Edge(transform, load))

# Execute
workflow.run(input_data)`,
    tools: `from agenticx.tools import tool

@tool
def search_database(query: str) -> list:
    """Search internal database"""
    return db.query(query)

@tool
def send_email(to: str, subject: str, body: str):
    """Send email notification"""
    mailer.send(to, subject, body)

# Tools auto-registered with agents`,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 动画样式 */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-gradient { animation: gradient 3s ease infinite; }
        .animate-gradient-x { animation: gradient-x 3s ease infinite; }
        .animate-fade-in { animation: fade-in 0.5s ease forwards; }
        .animate-blink { animation: blink 1s infinite; }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">AX</span>
            </div>
            <span className="text-lg font-semibold tracking-tight">AgenticX</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">Features</a>
            <a href="#code" className="text-sm text-neutral-400 hover:text-white transition-colors">Examples</a>
            <Link href="/docs" className="text-sm text-neutral-400 hover:text-white transition-colors">Documentation</Link>
            <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
              <Button size="sm" variant="outline" className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </Link>
          </div>

          <button 
            className="md:hidden text-neutral-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-900 bg-black">
            <div className="px-6 py-4 space-y-4">
              <a href="#features" className="block text-sm text-neutral-400">Features</a>
              <a href="#code" className="block text-sm text-neutral-400">Examples</a>
              <a href="https://github.com/DemonDamon/AgenticX" target="_blank" className="block text-sm text-neutral-400">Documentation</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              Build multi-agent systems
              <br />
              <GradientText>without the complexity</GradientText>
            </h1>
            <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-2xl">
              A unified, production-ready framework for building intelligent agent applications. 
              From simple automation to complex multi-agent collaboration.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="#quickstart">
                <Button size="lg" className="bg-white text-black hover:bg-neutral-200 group">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                <Button size="lg" variant="outline" className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900">
                  View on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-3">Core capabilities</h2>
            <p className="text-neutral-400">Everything you need to build production agent systems.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {features.map((feature, index) => (
              <GradientBorder key={index}>
                <div className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="font-medium">{feature.title}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4">{feature.description}</p>
                  <div className="mt-auto">
                    {feature.demo}
                  </div>
                </div>
              </GradientBorder>
            ))}
          </div>
        </div>
      </section>

      {/* More Features Grid */}
      <section className="py-20 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-900">
            {[
              { icon: <MessageSquare className="w-5 h-5" />, title: 'A2A Communication', desc: 'Inter-agent messaging protocol' },
              { icon: <Terminal className="w-5 h-5" />, title: 'MCP Protocol', desc: 'Model Context Protocol support' },
              { icon: <Activity className="w-5 h-5" />, title: 'Observability', desc: 'Tracing, metrics, monitoring' },
              { icon: <Cpu className="w-5 h-5" />, title: 'GUI Agent', desc: 'Desktop automation framework' },
              { icon: <Database className="w-5 h-5" />, title: 'Tool System', desc: 'Function decorators & remote tools' },
              { icon: <Layers className="w-5 h-5" />, title: 'Task Validation', desc: 'Pydantic output parsing' },
            ].map((item, index) => (
              <div 
                key={index} 
                className="p-6 bg-black hover:bg-neutral-950 transition-all duration-300 group cursor-default"
              >
                <div className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-neutral-500 group-hover:text-white group-hover:bg-neutral-800 transition-all duration-300 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section id="code" className="py-20 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-3">Simple to use</h2>
            <p className="text-neutral-400">Build complex systems with minimal code.</p>
          </div>

          <div className="flex gap-1 mb-4 p-1 bg-neutral-900 rounded-lg w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-neutral-800 text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Code Block */}
          <GradientBorder>
            <div className="rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-900">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-neutral-700" />
                  <div className="w-3 h-3 rounded-full bg-neutral-700" />
                  <div className="w-3 h-3 rounded-full bg-neutral-700" />
                </div>
                <span className="text-xs text-neutral-500 ml-2 font-mono">example.py</span>
              </div>
              <pre className="p-6 text-sm overflow-x-auto bg-neutral-950">
                <code className="font-mono text-neutral-300 leading-relaxed">
                  {codeExamples[activeTab as keyof typeof codeExamples]}
                </code>
              </pre>
            </div>
          </GradientBorder>
        </div>
      </section>

      {/* Quick Start */}
      <section id="quickstart" className="py-20 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-semibold mb-3">Quick start</h2>
            <p className="text-neutral-400">Get up and running in minutes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Install',
                code: 'pip install agenticx',
              },
              {
                step: '02',
                title: 'Configure',
                code: 'export OPENAI_API_KEY="..."',
              },
              {
                step: '03',
                title: 'Build',
                code: 'python your_agent.py',
              },
            ].map((item, index) => (
              <GradientBorder key={index}>
                <div className="p-6">
                  <div className="text-xs text-neutral-600 font-mono mb-3">{item.step}</div>
                  <h3 className="font-medium mb-3">{item.title}</h3>
                  <div className="bg-neutral-900 rounded-lg px-4 py-3 font-mono text-sm text-green-400">
                    $ {item.code}
                  </div>
                </div>
              </GradientBorder>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-4">Start building today</h2>
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
            Join developers building the next generation of AI applications.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
              <Button size="lg" className="bg-white text-black hover:bg-neutral-200 group">
                <Github className="w-4 h-4 mr-2" />
                Star on GitHub
              </Button>
            </Link>
            <Link href="https://pypi.org/project/agenticx/" target="_blank">
              <Button size="lg" variant="outline" className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900">
                PyPI Package
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-black font-bold text-xs">AX</span>
            </div>
            <span className="text-sm text-neutral-400">AgenticX</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">GitHub</Link>
            <Link href="https://pypi.org/project/agenticx/" target="_blank">PyPI</Link>
            <Link href="https://github.com/DemonDamon/AgenticX/blob/main/LICENSE" target="_blank">License</Link>
          </div>
          <p className="text-sm text-neutral-600">AGPL-3.0 License</p>
        </div>
      </footer>
    </div>
  );
}
