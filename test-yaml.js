const fs = require('fs');
const yaml = require('js-yaml');

try {
  const yamlContent = fs.readFileSync('./public/config/site.yaml', 'utf8');
  console.log('YAML文件前1000字符:');
  console.log(yamlContent.substring(0, 1000));
  console.log('\n=== 分割线 ===\n');
  
  const config = yaml.load(yamlContent);
  console.log('解析成功！');
  console.log('Footer配置:', JSON.stringify(config.footer, null, 2));
  
  if (config.footer) {
    console.log('\nSocial配置:', JSON.stringify(config.footer.social, null, 2));
    console.log('\nRepository配置:', JSON.stringify(config.footer.repository, null, 2));
    
    if (config.footer.repository) {
      console.log('\nRepository URL:', config.footer.repository.url);
      console.log('Repository Branch:', config.footer.repository.branch);
    }
  }
} catch(e) {
  console.error('解析错误:', e);
} 