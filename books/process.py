from __future__ import division
import nltk, codecs

def pieces(s):
    if len(s) > 40:
        s = s.replace(', ', ', !!SENT!! ')
    return s

#f=open('le_horla.txt')  # Python 2.7 sucks
with codecs.open('le_horla.txt', encoding='utf-8') as f:
  txt=f.read()

txt = txt.replace('\n', '<br/>')
nltk.data.load('tokenizers/punkt/french.pickle')      # tokenizers/punkt/french.pickle
sentences = nltk.sent_tokenize(txt)
sentences = [pieces(s) for s in sentences]


result = ' !!SENT!! '.join(sentences)
result = result.replace('<br/>', '\n')

# conver to RST
result = result.replace('_', '*')  # italics
result = result.replace('       *       *       *       *       *', '*****')

with codecs.open('out.txt', 'w', encoding='utf-8') as out:
    out.write(result)

# From rst2html.py
import subprocess
subprocess.call('rst2html.py out.txt > out.html', shell=True)

with codecs.open('out.html', encoding='utf-8') as f:
  txt=f.read()

txt = txt.replace('<p>', '<p><span>')
txt = txt.replace('</p>', '</span></p>')
txt = txt.replace('!!SENT!!', '</span><span>')
txt = txt.replace('--', '&nbsp;&mdash;&nbsp;')

txt = txt.replace('<span></span>', '')

class Counter:
    def __init__(self):
        self.count = -1
    def increment(self, matchObject):
        self.count += 1
        return '<span data-fragment="' + str(self.count) + '">'
c = Counter()

import re
span_re = re.compile('<span>')
txt = span_re.sub(c.increment, txt) 

with codecs.open('out2.html', 'w', encoding='utf-8') as out:
    out.write(txt)
