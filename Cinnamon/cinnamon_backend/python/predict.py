import sys
import json
import numpy as np
from sklearn.linear_model import LinearRegression

if len(sys.argv) < 2:
    print(0)
    sys.exit()

sales = json.loads(sys.argv[1])

if not sales or len(sales) < 2:
    print(sales[-1] if sales else 0)
    sys.exit()

X = np.array(range(len(sales))).reshape(-1, 1)
y = np.array(sales)

model = LinearRegression()
model.fit(X, y)

prediction = model.predict([[len(sales)]])
print(round(float(prediction[0])))
