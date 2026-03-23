import Link from 'next/link';
import { DocContent } from '@/components/docs/content';
import { 
  Rocket, 
  BookOpen, 
  Code, 
  Wrench, 
  Cpu, 
  Network,
  Terminal,
  HelpCircle
} from 'lucide-react';

export default function DocsPage() {
  return (
    <DocContent 
      title="Documentation" 
      description="Welcome to AgenticX documentation. Build multi-agent systems without the complexity."
      slug="index"
    >
      <p>
        AgenticX is a unified, production-ready framework for building intelligent agent 
        applications. From simple automation to complex multi-agent collaboration.
      </p>

      <h2>Quick Start</h2>
      <div className="grid gap-4 not-prose md:grid-cols-2">
        <Link
          href="/docs/getting-started/installation"
          className="group flex items-start gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-blue-500/50 hover:bg-gray-900"
        >
          <div className="rounded-lg bg-blue-500/20 p-3">
            <Rocket className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-blue-400">
              Installation
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Get started with AgenticX in minutes
            </p>
          </div>
        </Link>
        <Link
          href="/docs/getting-started/quickstart"
          className="group flex items-start gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-blue-500/50 hover:bg-gray-900"
        >
          <div className="rounded-lg bg-green-500/20 p-3">
            <Code className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-white group-hover:text-green-400">
              Quick Start
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Create your first agent and run tasks
            </p>
          </div>
        </Link>
      </div>

      <h2>Core Concepts</h2>
      <div className="grid gap-4 not-prose md:grid-cols-3">
        <Link
          href="/docs/concepts/agent"
          className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-gray-700 hover:bg-gray-900"
        >
          <Cpu className="h-8 w-8 text-purple-400" />
          <h3 className="mt-4 font-medium text-white">Agent</h3>
          <p className="mt-2 text-sm text-gray-400">
            The fundamental building block for intelligent agents
          </p>
        </Link>
        <Link
          href="/docs/concepts/tools"
          className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-gray-700 hover:bg-gray-900"
        >
          <Wrench className="h-8 w-8 text-orange-400" />
          <h3 className="mt-4 font-medium text-white">Tools</h3>
          <p className="mt-2 text-sm text-gray-400">
            Extend agent capabilities with function tools
          </p>
        </Link>
        <Link
          href="/docs/concepts/workflow"
          className="group rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-gray-700 hover:bg-gray-900"
        >
          <Network className="h-8 w-8 text-cyan-400" />
          <h3 className="mt-4 font-medium text-white">Workflow</h3>
          <p className="mt-2 text-sm text-gray-400">
            Orchestrate complex multi-agent interactions
          </p>
        </Link>
      </div>

      <h2>Reference</h2>
      <div className="grid gap-4 not-prose md:grid-cols-2">
        <Link
          href="/docs/cli"
          className="group flex items-start gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-gray-700 hover:bg-gray-900"
        >
          <Terminal className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="font-medium text-white">CLI Reference</h3>
            <p className="mt-1 text-sm text-gray-400">
              Complete command-line interface documentation
            </p>
          </div>
        </Link>
        <Link
          href="/docs/faq"
          className="group flex items-start gap-4 rounded-lg border border-gray-800 bg-gray-900/50 p-6 transition-colors hover:border-gray-700 hover:bg-gray-900"
        >
          <HelpCircle className="h-6 w-6 text-gray-400" />
          <div>
            <h3 className="font-medium text-white">FAQ</h3>
            <p className="mt-1 text-sm text-gray-400">
              Frequently asked questions and answers
            </p>
          </div>
        </Link>
      </div>

      <h2>Resources</h2>
      <ul>
        <li>
          <a href="https://github.com/DemonDamon/AgenticX" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </a>
        </li>
        <li>
          <a href="https://pypi.org/project/agenticx/" target="_blank" rel="noopener noreferrer">
            PyPI Package
          </a>
        </li>
        <li>
          <a href="https://github.com/DemonDamon/AgenticX/discussions" target="_blank" rel="noopener noreferrer">
            Community Discussions
          </a>
        </li>
      </ul>
    </DocContent>
  );
}
