import { SearchClient, Config } from 'coze-coding-dev-sdk';

async function checkDomains() {
  const config = new Config();
  const client = new SearchClient(config);
  
  const domains = [
    'agenticx.com',
    'agenticx.dev',
    'agenticx.ai',
    'agenticx.io',
    'agenticx.org',
    'agenticx.net'
  ];
  
  console.log('Checking domain availability for AgenticX...\n');
  console.log('=' .repeat(60));
  
  for (const domain of domains) {
    try {
      const response = await client.webSearch(`${domain} domain whois`, 3);
      
      // 检查是否有注册信息
      const hasRegistry = response.web_items?.some(item => 
        item.snippet?.toLowerCase().includes('registered') ||
        item.snippet?.toLowerCase().includes('registrar') ||
        item.snippet?.toLowerCase().includes('creation date') ||
        item.title?.toLowerCase().includes('whois')
      );
      
      console.log(`\n${domain}`);
      if (hasRegistry) {
        console.log(`  Status: Likely REGISTERED`);
        const firstItem = response.web_items?.[0];
        if (firstItem) {
          console.log(`  Info: ${firstItem.snippet?.substring(0, 100)}...`);
        }
      } else {
        console.log(`  Status: Check manually`);
      }
      
      // 添加延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log(`\n${domain}`);
      console.log(`  Status: Error checking`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\nRecommendation: Check these domains directly on:');
  console.log('- https://www.namecheap.com');
  console.log('- https://pypi.org/project/agenticx/ (package name)');
  console.log('- https://github.com/DemonDamon/AgenticX (repo exists)');
}

checkDomains().catch(console.error);
