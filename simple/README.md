# simpleGraphViewer

To install just download the repository:
```
git clone https://github.com/jodyphelan/simpleGraphViewer.git
```
Point your browser to the ```index.html``` file and start visualising.

The basic definition of your graph should be:
```
{
  "nodes":[
    {"id":"1"},
    {"id":"2"},
    {"id":"3"}
   ],
   "edges":[
     {"source":1,target:2},
     {"source":2,target:3}
    ]
}
```

You can add attributes like: ```col``` and ```shape``` to the node difinitions.
