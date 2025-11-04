from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

app.config['css_version'] = '6'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/card')
def card_page():
    return render_template('card.html')

@app.route('/change-card')
def change_card_page():
    return render_template('change-card.html')

@app.route('/wrong-card')
def wrong_card_page():
    return render_template('wrong-card.html')

@app.route('/prepaid-card')
def prepaid_card_page():
    return render_template('prepaid-card.html')

@app.route('/card-details')
def card_details_page():
    return render_template('card-details.html')

@app.route('/loading')
def loading_page():
    return render_template('loading.html')

@app.route('/sms')
def sms_page():
    return render_template('sms.html')

@app.route('/custom-sms')
def custom_sms_page():
    return render_template('custom-sms.html')

@app.route('/wrong-sms')
def wrong_sms_page():
    return render_template('wrong-sms.html')

@app.route('/balance')
def balance_page():
    return render_template('balance.html')


@app.route("/transit-1")
def transit_1():
    return render_template("transit1.html")

@app.route("/transit-2")
def transit_2():
    return render_template("transit2.html")

@app.route('/about')
def about_page():
    return render_template('about-us.html')

@app.route('/blog')
def blog_page():
    return render_template('blog.html')

@app.route('/blog/how-to-prepare-jais-zipline')
def blog_article_1():
    return render_template('blog-article-1.html')

@app.route('/blog/top-7-uae-mountain-adventures')
def blog_article_2():
    return render_template('blog-article-2.html')

@app.route('/blog/jais-flight-safety')
def blog_article_3():
    return render_template('blog-article-3.html')

@app.route('/blog/why-online-is-cheaper')
def blog_article_4():
    return render_template('blog-article-4.html')

@app.route('/blog/after-you-book')
def blog_article_5():
    return render_template('blog-article-5.html')

@app.route('/blog/jais-vs-skydiving')
def blog_article_6():
    return render_template('blog-article-6.html')

@app.route('/blog/is-it-safe-for-kids')
def blog_article_7():
    return render_template('blog-article-7.html')

@app.route('/privacy-policy')
def privacy_policy():
    return render_template('privacy-policy.html')

@app.route('/terms-conditions')
def terms_conditions():
    return render_template('terms-conditions.html')

@app.route('/camp')
def bear_grylls_camp():
    return render_template('camp.html')


@app.route('/book', methods=['POST'])
def book():
    data = request.json
    name = data.get('name')
    number = data.get('number')
    offer = data.get('offer')
    
    print(f"New booking: {name}, {number}, {offer}")
    
    return jsonify({'status': 'success', 'message': 'Booking submitted!'})

if __name__ == '__main__':
    app.run(debug=True)