from flask import Flask, render_template

app = Flask(__name__, static_url_path='', static_folder='static', template_folder='templates')

@app.route('/')
def home():
    return render_template('index.html')

# ניתוב דינמי לכל שאר הדפים (about.html, contact.html, service.html וכו')
@app.route('/<page_name>')
def render_page(page_name):
    if not page_name.endswith('.html'):
        page_name += '.html'
    try:
        return render_template(page_name)
    except Exception:
        return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)