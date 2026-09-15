# Football Player Value Prediction

Ett Machine Learning-projekt som använder statistik om fotbollsspelare för att prediktera deras marknadsvärde.

## Dataset

Projektet använder datasetet [Football Data from Transfermarkt](https://www.kaggle.com/datasets/davidcariboo/player-scores) från Kaggle.

Ladda ner datasetet och placera CSV-filerna i mappen:

```text
underlag/
```

Mappen är exkluderad från Git eftersom datasetet innehåller filer som överskrider GitHubs storleksgräns.

## Teknik

* Python
* Jupyter Notebook
* pandas
* scikit-learn
* matplotlib

## Installation

Skapa en virtuell Python-miljö:

```bash
python -m venv .venv
```

Aktivera miljön på Windows:

```bash
.venv\Scripts\activate
```

Aktivera miljön på macOS eller Linux:

```bash
source .venv/bin/activate
```

Installera projektets dependencies:

```bash
pip install -r requirements.txt
```

## Starta projektet

Starta Jupyter Notebook:

```bash
jupyter notebook
```
