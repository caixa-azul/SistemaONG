import urllib.request
import urllib.parse
import re
import json
import sys
import ssl
from html.parser import HTMLParser

# 🛡️ Bypass SSL verification for some legacy sites (Use with caution)
ssl._create_default_https_context = ssl._create_unverified_context

class UniversalParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.data = {
            "metadata": {"title": "", "description": "", "keywords": ""},
            "structure": {"h1": [], "h2": [], "h3": []},
            "contact": {"emails": set(), "phones": set(), "cnpjs": set()},
            "socials": set(),
            "links": {"internal": set(), "external": set()},
            "images": set(),
            "text_content": []
        }
        self.current_tag = ""
        self.in_title = False
        self.base_url = ""

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        attrs_dict = dict(attrs)

        # Metadata
        if tag == 'title':
            self.in_title = True
        elif tag == 'meta':
            name = attrs_dict.get('name', '').lower()
            if name == 'description':
                self.data['metadata']['description'] = attrs_dict.get('content', '')
            elif name == 'keywords':
                self.data['metadata']['keywords'] = attrs_dict.get('content', '')

        # Links & Socials
        if tag == 'a':
            href = attrs_dict.get('href')
            if href:
                full_url = urllib.parse.urljoin(self.base_url, href)
                if any(s in full_url for s in ['instagram.com', 'facebook.com', 'youtube.com', 'linkedin.com', 'twitter.com', 'tiktok.com']):
                    self.data['socials'].add(full_url)
                elif self.base_url in full_url:
                    self.data['links']['internal'].add(full_url)
                elif href.startswith('http'):
                    self.data['links']['external'].add(full_url)

        # Images
        if tag == 'img':
            src = attrs_dict.get('src')
            if src:
                self.data['images'].add(urllib.parse.urljoin(self.base_url, src))

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False
        self.current_tag = ""

    def handle_data(self, data):
        text = data.strip()
        if not text:
            return

        # Title
        if self.in_title:
            self.data['metadata']['title'] = text

        # Headings
        if self.current_tag in ['h1', 'h2', 'h3']:
            self.data['structure'][self.current_tag].append(text)

        # Text Content (ignore scripts/styles)
        if self.current_tag not in ['script', 'style', 'meta', 'link']:
            self.data['text_content'].append(text)
            
            # Regex Extraction
            # Emails
            emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
            self.data['contact']['emails'].update(emails)
            
            # Phones (Generic & BR)
            phones = re.findall(r'\(?\d{2}\)?\s?\d{4,5}-?\d{4}', text)
            self.data['contact']['phones'].update(phones)
            
            # CNPJ (BR)
            cnpjs = re.findall(r'\d{2}\.\d{3}\.\d{3}/\d{4}-\d{2}', text)
            self.data['contact']['cnpjs'].update(cnpjs)

def scrape_site(url):
    print(f"🕷️  Scraping: {url} ...")
    
    try:
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
        req = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(req, timeout=10) as response:
            html_content = response.read().decode('utf-8', errors='ignore')

        parser = UniversalParser()
        parser.base_url = url
        parser.feed(html_content)

        # Clean up sets to lists for JSON serialization
        output = parser.data
        output['contact']['emails'] = list(output['contact']['emails'])
        output['contact']['phones'] = list(output['contact']['phones'])
        output['contact']['cnpjs'] = list(output['contact']['cnpjs'])
        output['socials'] = list(output['socials'])
        output['links']['internal'] = list(output['links']['internal'])
        output['links']['external'] = list(output['links']['external'])
        output['images'] = list(output['images'])
        
        # Summary of text (first 500 chars)
        output['summary'] = " ".join(output['text_content'])[:500] + "..."
        del output['text_content'] # Remove full text to keep output clean

        return output

    except Exception as e:
        return {"error": str(e), "url": url}

if __name__ == "__main__":
    target_url = sys.argv[1] if len(sys.argv) > 1 else "https://projetoalemdosolhos.com.br/"
    result = scrape_site(target_url)
    print(json.dumps(result, indent=2, ensure_ascii=False))
