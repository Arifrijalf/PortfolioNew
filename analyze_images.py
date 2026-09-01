from playwright.sync_api import sync_playwright
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto('https://45c4fbd4.portfolionew-avj.pages.dev/')
        page.wait_for_load_state('networkidle')
        
        img_info = page.evaluate('''
            () => {
                return Array.from(document.querySelectorAll('img')).map(img => ({
                    src: img.src,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    offsetWidth: img.offsetWidth,
                    offsetHeight: img.offsetHeight
                }));
            }
        ''')
        
        with open('image_audit.json', 'w') as f:
            json.dump(img_info, f, indent=2)
        
        browser.close()

if __name__ == '__main__':
    run()
