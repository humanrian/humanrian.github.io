import time
import math

def add():
    ques1 = input("1st number? ")
    while not ques1.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques2 = input("2nd number? ")
    while not ques2.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques1 = int(ques1)
    ques2 = int(ques2)
    counter = ques1 + ques2
    print(counter)

def sub():
    ques1 = input("1st number? ")
    while not ques1.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques2 = input("2nd number? ")
    while not ques2.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques1 = int(ques1)
    ques2 = int(ques2)
    counter = ques1 - ques2
    print(counter)

def multi():
    ques1 = input("1st number? ")
    while not ques1.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques2 = input("2nd number? ")
    while not ques2.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques1 = int(ques1)
    ques2 = int(ques2)
    counter = ques1 * ques2
    print(counter)

def divi():
    ques1 = input("1st number? ")
    while not ques1.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques2 = input("2nd number? ")
    while not ques2.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques1 = int(ques1)
    ques2 = int(ques2)
    counter = ques1 / ques2
    print(counter)

def powe():
    ques1 = input("1st number? ")
    while not ques1.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques2 = input("2nd number? ")
    while not ques2.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques1 = int(ques1)
    ques2 = int(ques2)
    counter = ques1 ** ques2
    print(counter)

def root():
    ques1 = input("1st number? ")
    while not ques1.isdigit():
        print("invalid input, exiting program")
        time.sleep(1)
        exit()
    ques1 = int(ques1)
    counter = math.sqrt(ques1)
    print(counter)

while True:
    ques = input("addition, subtraction, multiplication, division, power or root ")
    if ques == "addition":
        add()
    elif ques == "subtraction":
        sub()
    elif ques == "multiplication":
        multi()
    elif ques == "division":
        divi()
    elif ques == "power":
        powe()
    elif ques == "root":
        root()
    elif ques == "q":
        exit()
    elif ques == "Q":
        exit()
    else:
        print("invalid option")
