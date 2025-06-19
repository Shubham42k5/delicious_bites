from flask import Flask, render_template, request, redirect, url_for, flash
import mysql.connector
from mysql.connector import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
# app.secret_key = 'your_secret_key_here'

import os
app.secret_key = os.urandom(24)


# Database connection
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="deliciousbites"
)

@app.route('/')
def home():
    return render_template('login.html')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']

        mycursor = mydb.cursor(dictionary=True)
        mycursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = mycursor.fetchone()
        mycursor.close()

        if user and check_password_hash(user['password'], password):
            
            flash("✅ Login successful!", "success")
            # return render_template('index.html')
            return redirect(url_for('index'))
        else:
            flash("❌ Invalid email or password.", "error")
            return render_template('login.html')

    return render_template('login.html')

@app.route('/logout')
def logout():
    flash("✅ Log Out successful!", "success")
    return redirect(url_for('login'))

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        hashed_password = generate_password_hash(password)

        print(f"Trying to sign up: {username}, {email}")

        mycursor = mydb.cursor(dictionary=True)
        try:
            mycursor.execute(
                "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                (username, email, hashed_password)
            )
            mydb.commit()
            flash("✅ Signup successful! Please login.", "success")
            return redirect(url_for('login'))
        except IntegrityError as e:
            print(f"❌ IntegrityError: {e}")  # Debug output
            if e.errno == 1062:
                flash("⚠️ This email is already registered. Please log in.", "error")
            else:
                flash("❌ An error occurred. Please try again.", "error")
        finally:
            mycursor.close()

    return render_template('signup.html')


@app.route('/order', methods=['GET', 'POST'])
def order():
    if request.method == 'POST':
        pizza = request.form['pizza']
        quantity = request.form['quantity']
        address = request.form['address']
        phone = request.form['phone']

        try:
            mycursor = mydb.cursor()
            mycursor.execute(
                "INSERT INTO orders (pizza, quantity, address, phone) VALUES (%s, %s, %s, %s)",
                (pizza, quantity, address, phone)
            )
            mydb.commit()
            mycursor.close()
            flash("✅ Order placed successfully!", "success")
            return redirect(url_for('order_success'))
        except Exception as e:
            flash(f"❌ Failed to place order: {str(e)}", "error")
            return render_template('order.html')

    return render_template('order.html')


@app.route('/order_success')
def order_success():
    return render_template('order_success.html')


if __name__ == '__main__':
    app.run(debug=True)
