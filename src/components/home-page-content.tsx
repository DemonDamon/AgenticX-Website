'use client';

import { useState, useEffect } from 'react';
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
  Check,
} from 'lucide-react';
import { SecurityAdvisoryBanner } from '@/components/security-advisory-banner';
import { SiteNav } from '@/components/site-nav';
import { useTranslations } from '@/i18n/locale-context';

function useTypewriter(text: string, speed: number = 50, delay: number = 0, pauseDuration: number = 2000) {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let i = 0;
    let timeout: NodeJS.Timeout;

    const startTyping = () => {
      if (isDeleting) {
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
        timeout = setTimeout(() => {
          if (i < text.length) {
            setDisplayText(text.slice(0, i + 1));
            i++;
          } else {
            setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
          }
        }, speed);
      }
    };

    const timer = setInterval(startTyping, 1);
    startTyping();

    return () => {
      clearTimeout(timeout);
      clearInterval(timer);
    };
  }, [text, speed, delay, pauseDuration, isDeleting]);

  return displayText;
}

function GradientBorder({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
      <div className="relative bg-neutral-950 rounded-xl">{children}</div>
    </div>
  );
}

function StepDemo() {
  const t = useTranslations();
  const [steps, setSteps] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      setSteps([]);
      [1, 2, 3].forEach((step, i) => {
        timers.push(
          setTimeout(() => {
            setSteps((prev) => [...prev, step]);
          }, 500 + i * 800),
        );
      });
      timers.push(
        setTimeout(() => {
          runAnimation();
        }, 500 + 3 * 800 + 2000),
      );
    };

    runAnimation();
    return () => timers.forEach(clearTimeout);
  }, []);

  const stepContent = [
    { title: t.home.features.stepDemo.parse, desc: t.home.features.stepDemo.parseDesc },
    { title: t.home.features.stepDemo.select, desc: t.home.features.stepDemo.selectDesc },
    { title: t.home.features.stepDemo.execute, desc: t.home.features.stepDemo.executeDesc },
  ];

  return (
    <div className="bg-neutral-900 rounded-lg p-4 min-h-[120px]">
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step} className="flex items-start gap-3 animate-fade-in">
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">
                Step {step}: {stepContent[step - 1].title}
              </div>
              <div className="text-xs text-neutral-500">{stepContent[step - 1].desc}</div>
            </div>
          </div>
        ))}
        {steps.length < 3 && (
          <div className="flex items-center gap-3 text-neutral-600">
            <div className="w-6 h-6 rounded-full border border-neutral-700 flex-shrink-0" />
            <div className="text-xs">{t.home.features.stepDemo.processing}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function TypedCode() {
  const code = `agent = Agent(
  id="assistant",
  role="AI Assistant"
)
result = executor.run(task)`;

  const displayText = useTypewriter(code, 30, 300);

  return (
    <div className="bg-neutral-900 rounded-lg p-4 font-mono text-sm min-h-[120px]">
      <div className="text-neutral-300 whitespace-pre">
        {displayText}
        <span className="animate-blink">|</span>
      </div>
    </div>
  );
}

function MemoryDemo() {
  const t = useTranslations();
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    const runAnimation = () => {
      setVisibleItems([]);
      [0, 1, 2].forEach((i) => {
        timers.push(
          setTimeout(() => {
            setVisibleItems((prev) => [...prev, i]);
          }, 200 + i * 400),
        );
      });
      timers.push(
        setTimeout(() => {
          runAnimation();
        }, 200 + 3 * 400 + 2000),
      );
    };

    runAnimation();
    return () => timers.forEach(clearTimeout);
  }, []);

  const items = [
    { text: t.home.features.memoryDemo.stored, color: 'bg-green-500' },
    { text: t.home.features.memoryDemo.retrieved, color: 'bg-blue-500' },
    { text: t.home.features.memoryDemo.consolidated, color: 'bg-purple-500' },
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

export function HomePageContent() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('agent');

  const features = [
    {
      icon: <Cpu className="w-5 h-5" />,
      title: t.home.features.agentCore.title,
      description: t.home.features.agentCore.description,
      demo: <TypedCode />,
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: t.home.features.orchestration.title,
      description: t.home.features.orchestration.description,
      demo: <StepDemo />,
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: t.home.features.memory.title,
      description: t.home.features.memory.description,
      demo: <MemoryDemo />,
    },
  ];

  const tabs = [
    { id: 'agent', label: t.home.code.tabs.agent },
    { id: 'workflow', label: t.home.code.tabs.workflow },
    { id: 'tools', label: t.home.code.tabs.tools },
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

extract = Node("extract", extractor_agent)
transform = Node("transform", transformer_agent)
load = Node("load", loader_agent)

workflow.add_edge(Edge(extract, transform))
workflow.add_edge(Edge(transform, load))

workflow.run(input_data)`,
    tools: `from agenticx.tools import tool

@tool
def search_database(query: str) -> list:
    """Search internal database"""
    return db.query(query)

@tool
def send_email(to: str, subject: str, body: str):
    """Send email notification"""
    mailer.send(to, subject, body)`,
  };

  return (
    <div className="min-h-screen bg-black text-white">
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

      <SiteNav />

      <main className="pt-16">
        <SecurityAdvisoryBanner align="marketing" />

        <section className="pt-16 pb-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
                {t.home.hero.titleLine1}
                <br />
                <GradientText>{t.home.hero.titleLine2}</GradientText>
              </h1>
              <p className="text-lg text-neutral-400 leading-relaxed mb-8 max-w-2xl">{t.home.hero.subtitle}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="#quickstart">
                  <Button size="lg" className="bg-white text-black hover:bg-neutral-200 group">
                    {t.home.hero.getStarted}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                  <Button size="lg" variant="outline" className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900">
                    {t.home.hero.viewGithub}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-6 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-3">{t.home.features.title}</h2>
              <p className="text-neutral-400">{t.home.features.subtitle}</p>
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
                    <div className="mt-auto">{feature.demo}</div>
                  </div>
                </GradientBorder>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-900">
              {[
                { icon: <MessageSquare className="w-5 h-5" />, title: t.home.grid.a2a.title, desc: t.home.grid.a2a.desc },
                { icon: <Terminal className="w-5 h-5" />, title: t.home.grid.mcp.title, desc: t.home.grid.mcp.desc },
                { icon: <Activity className="w-5 h-5" />, title: t.home.grid.observability.title, desc: t.home.grid.observability.desc },
                { icon: <Cpu className="w-5 h-5" />, title: t.home.grid.gui.title, desc: t.home.grid.gui.desc },
                { icon: <Database className="w-5 h-5" />, title: t.home.grid.tools.title, desc: t.home.grid.tools.desc },
                { icon: <Layers className="w-5 h-5" />, title: t.home.grid.validation.title, desc: t.home.grid.validation.desc },
              ].map((item, index) => (
                <div key={index} className="p-6 bg-black hover:bg-neutral-950 transition-all duration-300 group cursor-default">
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

        <section id="code" className="py-20 px-6 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-3">{t.home.code.title}</h2>
              <p className="text-neutral-400">{t.home.code.subtitle}</p>
            </div>
            <div className="flex gap-1 mb-4 p-1 bg-neutral-900 rounded-lg w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm rounded-md transition-all duration-300 ${
                    activeTab === tab.id ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
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

        <section id="quickstart" className="py-20 px-6 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-semibold mb-3">{t.home.quickstart.title}</h2>
              <p className="text-neutral-400">{t.home.quickstart.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { step: '01', title: t.home.quickstart.install, code: 'pip install agenticx' },
                { step: '02', title: t.home.quickstart.configure, code: 'export OPENAI_API_KEY="..."' },
                { step: '03', title: t.home.quickstart.build, code: 'python your_agent.py' },
              ].map((item, index) => (
                <GradientBorder key={index}>
                  <div className="p-6">
                    <div className="text-xs text-neutral-600 font-mono mb-3">{item.step}</div>
                    <h3 className="font-medium mb-3">{item.title}</h3>
                    <div className="bg-neutral-900 rounded-lg px-4 py-3 font-mono text-sm text-green-400">$ {item.code}</div>
                  </div>
                </GradientBorder>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-6 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-4">{t.home.cta.title}</h2>
            <p className="text-neutral-400 mb-8 max-w-xl mx-auto">{t.home.cta.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">
                <Button size="lg" className="bg-white text-black hover:bg-neutral-200 group">
                  <Github className="w-4 h-4 mr-2" />
                  {t.home.cta.starGithub}
                </Button>
              </Link>
              <Link href="https://pypi.org/project/agenticx/" target="_blank">
                <Button size="lg" variant="outline" className="border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-900">
                  {t.home.cta.pypiPackage}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 border-t border-neutral-900">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                <span className="text-black font-bold text-xs">AX</span>
              </div>
              <span className="text-sm text-neutral-400">AgenticX</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <Link href="https://github.com/DemonDamon/AgenticX" target="_blank">{t.common.github}</Link>
              <Link href="https://pypi.org/project/agenticx/" target="_blank">{t.common.pypi}</Link>
              <Link href="https://github.com/DemonDamon/AgenticX/blob/main/LICENSE" target="_blank">{t.common.license}</Link>
            </div>
            <p className="text-sm text-neutral-600">{t.home.footer.license}</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
