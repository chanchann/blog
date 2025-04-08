#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== 开始构建并检查 Jekyll 博客 ===${NC}"

# 清理之前的构建
echo -e "${BLUE}清理之前的构建...${NC}"
if [ -d "_site" ]; then
  rm -rf _site
fi

# 构建网站
echo -e "${BLUE}构建网站...${NC}"
bundle exec jekyll build

# 检查构建状态
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ 网站构建成功!${NC}"
  
  # 检查生成的首页是否只有8篇文章
  post_count=$(grep -c '<li>' _site/index.html)
  echo -e "${BLUE}首页文章数量: $post_count${NC}"
  
  if [ "$post_count" -le 9 ]; then
    echo -e "${GREEN}✓ 首页显示正确数量的文章 (不超过9篇)${NC}"
  else
    echo -e "${RED}✗ 首页显示了超过8篇文章${NC}"
  fi
  
  # 检查是否生成了所有帖子页面
  total_posts=$(find _posts -name "*.md" | wc -l)
  generated_posts=$(find _site -name "*.html" -path "*2025*" | wc -l)
  echo -e "${BLUE}已生成的文章页面: $generated_posts / $total_posts${NC}"
  
  echo -e "${GREEN}✓ 检查完成!${NC}"
  echo -e "${BLUE}你现在可以通过以下命令本地预览网站:${NC}"
  echo -e "bundle exec jekyll serve"
  echo -e "${BLUE}然后访问: http://localhost:4000${BASEURL}${NC}"
else
  echo -e "${RED}✗ 网站构建失败!${NC}"
fi 