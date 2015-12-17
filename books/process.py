from __future__ import division
import nltk, codecs, re

# use nltk.download() to install the nltk punkt package

clause_re = re.compile('(.{30,}?), ')
def pieces(s):
    if len(s) > 50:
        clauses = clause_re.split(s)
        clauses = [c for c in clauses if c != '']
        return ',\n'.join(clauses)
    else:
        return s

# Create one line per text fragment.

#f=open('le_horla.txt')  # Python 2.7 sucks
with codecs.open('le_horla.txt', encoding='utf-8') as f:
  txt=f.read()

txt = txt.replace('\r', '')
txt = txt.replace('\n\n', ' PARAGRAPH BREAK. ')
txt = txt.replace('\n', ' ')
nltk.data.load('tokenizers/punkt/french.pickle')      # tokenizers/punkt/french.pickle
sentences = nltk.sent_tokenize(txt)
# sentences = [pieces(s) for s in sentences]  # leave as whole sentences for easier comprehension (even though they can be a bit long in french literature...)

result = '\n'.join(sentences)
result = result.replace('PARAGRAPH BREAK.', '\nPARAGRAPH BREAK.')
result = result.replace('\n\n', '\n')

# convert to RST
result = result.replace('*       *       *       *       *', '*****')
# result = result.replace('--', '&nbsp;&mdash;&nbsp;')

with codecs.open('out.txt', 'w', encoding='utf-8') as out:
    out.write(result)

    
if False:

    # From rst2html.py
    import subprocess
    subprocess.call('rst2html.py --template=template.txt out.txt > out.html', shell=True)
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
            return '<div class="fragment" data-fragment="' + str(self.count) + '">'
    c = Counter()
    
    span_re = re.compile('<span>')
    txt = span_re.sub(c.increment, txt) 
    
    txt = txt.replace('\n', '')
    txt = txt.replace('</p><p>', '\n<div class="para"></div>\n')
    txt = txt.replace('<p>', '')
    txt = txt.replace('</span>', '</div>')
    
    with codecs.open('out2.html', 'w', encoding='utf-8') as out:
        out.write(txt)
