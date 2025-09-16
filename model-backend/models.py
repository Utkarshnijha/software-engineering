# %%
# data analysis and wrangling
import pandas as pd
import numpy as np
import random as rnd
import os
import pickle
from uuid import uuid4

# visualization
import seaborn as sns
import matplotlib.pyplot as plt

# machine learning
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC, LinearSVC
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import Perceptron
from sklearn.linear_model import SGDClassifier
from sklearn.tree import DecisionTreeClassifier

current_dir = os.path.dirname(__file__)  # .../model-backend/Models

# os.makedirs(os.path.join(current_dir, "Plots"), exist_ok=True)
os.makedirs(os.path.join(current_dir, "Models"), exist_ok=True)
model_dir = os.path.join(current_dir, "Models")

csv_path_train = os.path.join(current_dir, "Data", "train.csv")
csv_path_test = os.path.join(current_dir, "Data", "test.csv")

train_df = pd.read_csv(csv_path_train)
test_df = pd.read_csv(csv_path_test)
combine = [train_df, test_df]

train_df.info()
test_df.info()

g = sns.FacetGrid(train_df, col="Survived")
g.map(plt.hist, "Age", bins=20)
# plt.savefig("Plots/Survived.jpg")
# grid = sns.FacetGrid(train_df, col='Pclass', hue='Survived')
grid = sns.FacetGrid(train_df, col="Survived", row="Pclass", aspect=1.6)
grid.map(plt.hist, "Age", alpha=0.5, bins=20)
grid.add_legend()
# plt.savefig("Plots/PClass.jpg")
# grid = sns.FacetGrid(train_df, col='Embarked')
grid = sns.FacetGrid(train_df, row="Embarked", aspect=1.6)
grid.map(sns.pointplot, "Pclass", "Survived", "Sex", palette="deep")
grid.add_legend()
# plt.savefig("Plots/Sex.jpg")
# grid = sns.FacetGrid(train_df, col='Embarked', hue='Survived', palette={0: 'k', 1: 'w'})
grid = sns.FacetGrid(train_df, row="Embarked", col="Survived", aspect=1.6)
grid.map(sns.barplot, "Sex", "Fare", alpha=0.5, ci=None)
grid.add_legend()
# plt.savefig("Plots/Fare.jpg")

train_df = train_df.drop(["Ticket", "Cabin"], axis=1)
test_df = test_df.drop(["Ticket", "Cabin"], axis=1)
combine = [train_df, test_df]

for dataset in combine:
    dataset["Title"] = dataset.Name.str.extract(" ([A-Za-z]+)\.", expand=False)

pd.crosstab(train_df["Title"], train_df["Sex"])

for dataset in combine:
    dataset["Title"] = dataset["Title"].replace(
        [
            "Lady",
            "Countess",
            "Capt",
            "Col",
            "Don",
            "Dr",
            "Major",
            "Rev",
            "Sir",
            "Jonkheer",
            "Dona",
        ],
        "Rare",
    )

    dataset["Title"] = dataset["Title"].replace("Mlle", "Miss")
    dataset["Title"] = dataset["Title"].replace("Ms", "Miss")
    dataset["Title"] = dataset["Title"].replace("Mme", "Mrs")

train_df[["Title", "Survived"]].groupby(["Title"], as_index=False).mean()

title_mapping = {"Mr": 1, "Miss": 2, "Mrs": 3, "Master": 4, "Rare": 5}
for dataset in combine:
    dataset["Title"] = dataset["Title"].map(title_mapping)
    dataset["Title"] = dataset["Title"].fillna(0)

train_df = train_df.drop(["Name", "PassengerId"], axis=1)
test_df = test_df.drop(["Name"], axis=1)
combine = [train_df, test_df]

for dataset in combine:
    dataset["Sex"] = dataset["Sex"].map({"female": 1, "male": 0}).astype(int)

train_df.head()

# grid = sns.FacetGrid(train_df, col='Pclass', hue='Gender')
grid = sns.FacetGrid(train_df, row="Pclass", col="Sex", aspect=1.6)
grid.map(plt.hist, "Age", alpha=0.5, bins=20)
grid.add_legend()

guess_ages = np.zeros((2, 3))

for dataset in combine:
    for i in range(0, 2):
        for j in range(0, 3):
            guess_df = dataset[(dataset["Sex"] == i) & (dataset["Pclass"] == j + 1)][
                "Age"
            ].dropna()

            # age_mean = guess_df.mean()
            # age_std = guess_df.std()
            # age_guess = rnd.uniform(age_mean - age_std, age_mean + age_std)

            age_guess = guess_df.median()

            # Convert random age float to nearest .5 age
            guess_ages[i, j] = int(age_guess / 0.5 + 0.5) * 0.5

    for i in range(0, 2):
        for j in range(0, 3):
            dataset.loc[
                (dataset.Age.isnull()) & (dataset.Sex == i) & (dataset.Pclass == j + 1),
                "Age",
            ] = guess_ages[i, j]

    dataset["Age"] = dataset["Age"].astype(int)

train_df.head()

train_df["AgeBand"] = pd.cut(train_df["Age"], 5)
train_df[["AgeBand", "Survived"]].groupby(
    ["AgeBand"], as_index=False
).mean().sort_values(by="AgeBand", ascending=True)

for dataset in combine:
    dataset.loc[dataset["Age"] <= 16, "Age"] = 0
    dataset.loc[(dataset["Age"] > 16) & (dataset["Age"] <= 32), "Age"] = 1
    dataset.loc[(dataset["Age"] > 32) & (dataset["Age"] <= 48), "Age"] = 2
    dataset.loc[(dataset["Age"] > 48) & (dataset["Age"] <= 64), "Age"] = 3
    dataset.loc[dataset["Age"] > 64, "Age"]

train_df = train_df.drop(["AgeBand"], axis=1)
combine = [train_df, test_df]

for dataset in combine:
    dataset["FamilySize"] = dataset["SibSp"] + dataset["Parch"] + 1

train_df[["FamilySize", "Survived"]].groupby(
    ["FamilySize"], as_index=False
).mean().sort_values(by="Survived", ascending=False)

for dataset in combine:
    dataset["IsAlone"] = 0
    dataset.loc[dataset["FamilySize"] == 1, "IsAlone"] = 1

train_df[["IsAlone", "Survived"]].groupby(["IsAlone"], as_index=False).mean()

train_df = train_df.drop(["Parch", "SibSp", "FamilySize"], axis=1)
test_df = test_df.drop(["Parch", "SibSp", "FamilySize"], axis=1)
combine = [train_df, test_df]

for dataset in combine:
    dataset["Age*Class"] = dataset.Age * dataset.Pclass

train_df.loc[:, ["Age*Class", "Age", "Pclass"]].head(10)

freq_port = train_df.Embarked.dropna().mode()[0]

for dataset in combine:
    dataset["Embarked"] = dataset["Embarked"].fillna(freq_port)

train_df[["Embarked", "Survived"]].groupby(
    ["Embarked"], as_index=False
).mean().sort_values(by="Survived", ascending=False)

for dataset in combine:
    dataset["Embarked"] = dataset["Embarked"].map({"S": 0, "C": 1, "Q": 2}).astype(int)

train_df.head()

test_df["Fare"].fillna(test_df["Fare"].dropna().median(), inplace=True)

train_df["FareBand"] = pd.qcut(train_df["Fare"], 4)
train_df[["FareBand", "Survived"]].groupby(
    ["FareBand"], as_index=False
).mean().sort_values(by="FareBand", ascending=True)

for dataset in combine:
    dataset.loc[dataset["Fare"] <= 7.91, "Fare"] = 0
    dataset.loc[(dataset["Fare"] > 7.91) & (dataset["Fare"] <= 14.454), "Fare"] = 1
    dataset.loc[(dataset["Fare"] > 14.454) & (dataset["Fare"] <= 31), "Fare"] = 2
    dataset.loc[dataset["Fare"] > 31, "Fare"] = 3
    dataset["Fare"] = dataset["Fare"].astype(int)

train_df = train_df.drop(["FareBand", "Age*Class"], axis=1)
test_df = test_df.drop(["Age*Class"], axis=1)
combine = [train_df, test_df]

X_train = train_df.drop("Survived", axis=1)
Y_train = train_df["Survived"]
X_test = test_df.drop("PassengerId", axis=1).copy()

logreg = LogisticRegression()
logreg.fit(X_train, Y_train)
Y_pred = logreg.predict(X_test)
acc_log = round(logreg.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "logistic_model.pkl"), "wb") as f:
    pickle.dump(logreg, f)

coeff_df = pd.DataFrame(train_df.columns.delete(0))
coeff_df.columns = ["Feature"]
coeff_df["Correlation"] = pd.Series(logreg.coef_[0])

svc = SVC()
svc.fit(X_train, Y_train)
Y_pred = svc.predict(X_test)
acc_svc = round(svc.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "SVM.pkl"), "wb") as f:
    pickle.dump(svc, f)

knn = KNeighborsClassifier(n_neighbors=3)
knn.fit(X_train, Y_train)
Y_pred = knn.predict(X_test)
acc_knn = round(knn.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "KNN.pkl"), "wb") as f:
    pickle.dump(knn, f)

gaussiannb = GaussianNB()
gaussiannb.fit(X_train, Y_train)
Y_pred = gaussiannb.predict(X_test)
acc_gaussian = round(gaussiannb.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "NaiveBayes.pkl"), "wb") as f:
    pickle.dump(gaussiannb, f)

perceptron = Perceptron()
perceptron.fit(X_train, Y_train)
Y_pred = perceptron.predict(X_test)
acc_perceptron = round(perceptron.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "Perceptron.pkl"), "wb") as f:
    pickle.dump(perceptron, f)

linear_svc = LinearSVC()
linear_svc.fit(X_train, Y_train)
Y_pred = linear_svc.predict(X_test)
acc_linear_svc = round(linear_svc.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "LinearSVM.pkl"), "wb") as f:
    pickle.dump(linear_svc, f)

sgd = SGDClassifier()
sgd.fit(X_train, Y_train)
Y_pred = sgd.predict(X_test)
acc_sgd = round(sgd.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "SGD.pkl"), "wb") as f:
    pickle.dump(sgd, f)

decision_tree = DecisionTreeClassifier()
decision_tree.fit(X_train, Y_train)
Y_pred = decision_tree.predict(X_test)
acc_decision_tree = round(decision_tree.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "DecisionTree.pkl"), "wb") as f:
    pickle.dump(decision_tree, f)

random_forest = RandomForestClassifier(n_estimators=100)
random_forest.fit(X_train, Y_train)
Y_pred = random_forest.predict(X_test)
random_forest.score(X_train, Y_train)
acc_random_forest = round(random_forest.score(X_train, Y_train) * 100, 2)
with open(os.path.join(model_dir, "RandomForest.pkl"), "wb") as f:
    pickle.dump(random_forest, f)

models = pd.DataFrame(
    {
        "Model": [
            "Support Vector Machines",
            "KNN",
            "Logistic Regression",
            "Random Forest",
            "Naive Bayes",
            "Perceptron",
            "Stochastic Gradient Decent",
            "Linear SVC",
            "Decision Tree",
        ],
        "Score": [
            acc_svc,
            acc_knn,
            acc_log,
            acc_random_forest,
            acc_gaussian,
            acc_perceptron,
            acc_sgd,
            acc_linear_svc,
            acc_decision_tree,
        ],
    }
)
print(models.sort_values(by="Score", ascending=False))

submission = pd.DataFrame({"PassengerId": test_df["PassengerId"], "Survived": Y_pred})


# Map human-readable names to sklearn classes
CLASSIFIERS = {
    "RandomForest": RandomForestClassifier,
    "DecisionTree": DecisionTreeClassifier,
    "KNN":          KNeighborsClassifier,
    "SVM":          SVC,
    "LinearSVM":    LinearSVC,
    "Logistic":     LogisticRegression,
    "SGD":          SGDClassifier,
    "Perceptron":   Perceptron,
}

def train_pipeline(features: list[str], algorithm: str = "RandomForest"):
    """
    On-demand training: select only `features` columns + Survived, fit the requested algorithm.
    """
    df = pd.read_csv(csv_path_train)
    X = df[features]
    y = df["Survived"]

    Cls = CLASSIFIERS.get(algorithm)
    if Cls is None:
        raise ValueError(f"Unknown algorithm: {algorithm}")

    model = Cls()
    model.fit(X, y)
    return model

CLASSIFIERS = {
    "RandomForest":   RandomForestClassifier,
    "DecisionTree":   DecisionTreeClassifier,
    "KNN":            KNeighborsClassifier,
    "SVM":            SVC,
    "LinearSVM":      LinearSVC,
    "Logistic":       LogisticRegression,
    "SGD":            SGDClassifier,
    "Perceptron":     Perceptron,
}

def train_pipeline(features: list[str], algorithm: str = "RandomForest"):
    """
    On-demand training: select only `features` columns + Survived, 
    fit the requested algorithm, and return the fitted model.
    """
    df = pd.read_csv(csv_path_train)
    X  = df[features]
    y  = df["Survived"]

    Cls = CLASSIFIERS.get(algorithm)
    if Cls is None:
        raise ValueError(f"Unknown algorithm: {algorithm}")

    model = Cls()
    model.fit(X, y)
    return model