from __future__ import division
import nltk, codecs

#f=open('le_horla.txt')  # Python 2.7 sucks
with codecs.open('le_horla.txt', encoding='utf-8') as f:
  txt=f.read()

txt = txt.replace('\n', '<br/>')
nltk.data.load('tokenizers/punkt/french.pickle')      # tokenizers/punkt/french.pickle
sentences = nltk.sent_tokenize(txt)
result = '<SENT/>'.join(sentences)
result = result.replace('<br/>', '\n')

with codecs.open('out', 'w', encoding='utf-8') as out:
    out.write(result)
