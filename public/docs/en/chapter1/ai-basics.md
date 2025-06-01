# 1.1 The "Two Hands and Four Legs" of Artificial Intelligence

## Overview of Artificial Intelligence

What does artificial intelligence look like? To give a vivid description, artificial intelligence has "two hands and four legs". The "two hands" represent the two major types of tasks that AI can perform: **prediction and decision-making**.

### Characteristics of Prediction Tasks

Prediction includes:
- Pattern recognition for given input targets
- Label classification, regression, or predicting future data
- Data clustering or generation

For example, speech recognition and synthesis are typical prediction tasks.

### Characteristics of Decision-Making Tasks

Decision-making includes understanding the given environment, planning for the future, and making optimal decisions for the current environment. For example, autonomous driving systems need to perceive the surrounding environment, plan driving routes, and make real-time driving decisions.

## Four Legs: Supporting Technologies

The "four legs" represent the four major categories of scientific technologies that support artificial intelligence:

### 1. Search Technology

Search is a method of exploring and selecting suitable environments in a given mathematical environment using established algorithms to ultimately make decisions.

#### Search Algorithm Classification
- **Blind Search**: Breadth-first, depth-first
- **Heuristic Search**: A* algorithm, greedy search
- **Game Search**: Minimax algorithm

### 2. Reasoning Technology

Reasoning is based on given rules or knowledge, using logical induction to derive further rules or knowledge.

#### Types of Reasoning
- **Deductive Reasoning**: From general to specific
- **Inductive Reasoning**: From specific to general
- **Abductive Reasoning**: Finding the best explanation

### 3. Learning Technology

Learning, i.e., machine learning, is an automated process where machines optimize task objectives through empirical data.

#### Learning Paradigms
- **Supervised Learning**: Training with labeled data
- **Unsupervised Learning**: Mining unlabeled data
- **Reinforcement Learning**: Learning strategies through rewards

### 4. Game Theory Technology

Game theory focuses on interactions between multiple AI agents, such as card and board game battles, football team cooperation, etc.

#### Types of Games
- **Perfect Information Games**: Chess, Go
- **Imperfect Information Games**: Poker, negotiation
- **Cooperative Games**: Team collaboration

## The Relationship Between AI and Machine Learning

Through the above description, we can roughly understand the full picture of artificial intelligence. In the past decade, the main progress in AI has been in machine learning technology, so much so that some students actually can't distinguish between artificial intelligence and machine learning.

### Technology Development Trends

In this book, we focus on discussing machine learning technologies that serve prediction tasks in artificial intelligence, while machine learning technologies that support AI agents in solving decision problems can use any of the methods in this book.

### Practical Application Scenarios

```python
# AI Application Examples
ai_applications = {
    "Prediction Tasks": {
        "Image Recognition": "CNN Deep Networks",
        "Speech Recognition": "RNN/Transformer",
        "Text Analysis": "NLP Models"
    },
    "Decision Tasks": {
        "Autonomous Driving": "Reinforcement Learning",
        "Game AI": "Monte Carlo Tree Search",
        "Recommendation Systems": "Collaborative Filtering"
    }
}
```

---

> **Summary**: The "two hands" of AI represent the two task types of prediction and decision-making, while the "four legs" represent the four supporting technologies: search, reasoning, learning, and game theory. This book focuses on machine learning technologies in prediction tasks. 