var levels = [];
var levelCount = 6;
for(var i = 1; i < levelCount + 1; i++){
    levels[i] = [];
}

//Level 1
levels[1]["start"] = [[400, 535]];
levels[1]["bombs"] = [[0, 400, 400]];
levels[1]["platforms"] = [];

//Level 2
levels[2]["start"] = [[400, 535]];
levels[2]["bombs"] = [[1, 400, 400]];
levels[2]["platforms"] = [];

//Level 3
levels[3]["start"] = [[400, 535]];
levels[3]["bombs"] = [[2, 400, 400]];
levels[3]["platforms"] = [];

//Level 4
levels[4]["start"] = [[400, 535]];
levels[4]["bombs"] = [
    [2, 500, 300],
    [1, 300, 300],
    [0, 400, 300],
];
levels[4]["platforms"] = [];

//Level 5 
levels[5]["start"] = [[400, 535]];
levels[5]["bombs"] = [[0, 400, 300]];
levels[5]["platforms"] = [
    [450, 450, 25, 125],
    [300, 450, 150, 25],
    [300, 450, 25, 75]
];

//Level 6
levels[6]["start"] = [[400, 535]];
levels[6]["bombs"] = [[0, 400, 100]];
levels[6]["platforms"] = [
    [450, 350, 25, 225],
    [300, 350, 150, 25],
    [300, 350, 25, 125],
    [300, 525, 25, 50]
];