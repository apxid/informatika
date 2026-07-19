/*
==========================================
TREE & GRAPH QUIZ
Developer : MB
Version : 1.0
==========================================
*/

const questions = [

{
    question: "Node yang berada paling atas pada Tree disebut ....",
    image: "assets/tree.png",
    options: [
        "Leaf",
        "Root",
        "Parent",
        "Child"
    ],
    answer: 1,
    explanation: "Root adalah node pertama atau node paling atas pada struktur Tree."
},

{
    question: "Node yang mempunyai Parent tetapi tidak mempunyai Child disebut ....",
    image: "assets/leaf.png",
    options: [
        "Root",
        "Parent",
        "Leaf",
        "Graph"
    ],
    answer: 2,
    explanation: "Leaf adalah node terakhir karena tidak mempunyai Child."
},

{
    question: "Pada File Manager Android, 'Memori Internal' merupakan contoh ....",
    image: "assets/folder.png",
    options: [
        "Leaf",
        "Root",
        "Child",
        "Graph"
    ],
    answer: 1,
    explanation: "Semua folder berada di bawah Memori Internal sehingga Memori Internal berperan sebagai Root."
},

{
    question: "Folder 'Music' berada di bawah 'Memori Internal'. Folder Music merupakan ....",
    image: "assets/folder.png",
    options: [
        "Root",
        "Parent",
        "Leaf",
        "Graph"
    ],
    answer: 1,
    explanation: "Music mempunyai Parent (Memori Internal) dan dapat memiliki Child sehingga termasuk Parent."
},

{
    question: "File 'Aku.mp3' berada di dalam folder Music. Aku.mp3 merupakan ....",
    image: "assets/music.png",
    options: [
        "Leaf",
        "Root",
        "Parent",
        "Graph"
    ],
    answer: 0,
    explanation: "File biasanya tidak memiliki Child sehingga termasuk Leaf."
},

{
    question: "Google Maps lebih tepat menggunakan struktur ....",
    image: "assets/graph.png",
    options: [
        "Tree",
        "Graph",
        "Root",
        "Leaf"
    ],
    answer: 1,
    explanation: "Jalan dapat memiliki banyak jalur sehingga lebih sesuai menggunakan Graph."
},

{
    question: "Hubungan pertemanan di Instagram merupakan contoh ....",
    image: "assets/graph.png",
    options: [
        "Tree",
        "Graph",
        "Leaf",
        "Parent"
    ],
    answer: 1,
    explanation: "Seseorang dapat berteman dengan banyak orang sehingga membentuk Graph."
},

{
    question: "Apakah semua Tree merupakan Graph?",
    image: "assets/tree.png",
    options: [
        "Ya",
        "Tidak",
        "Kadang-kadang",
        "Tidak tahu"
    ],
    answer: 0,
    explanation: "Tree merupakan salah satu jenis khusus dari Graph."
},

{
    question: "Mengapa tidak semua Graph disebut Tree?",
    image: "assets/graph.png",
    options: [
        "Karena memiliki lebih dari satu Root atau membentuk siklus",
        "Karena selalu mempunyai Leaf",
        "Karena semua Graph mempunyai Parent",
        "Karena Graph tidak mempunyai Node"
    ],
    answer: 0,
    explanation: "Graph dapat memiliki siklus (loop) atau lebih dari satu titik awal sehingga tidak memenuhi aturan Tree."
},

{
    question: "Jika dua cucu pada sebuah Tree saling dihubungkan langsung, maka strukturnya berubah menjadi ....",
    image: "assets/graph.png",
    options: [
        "Leaf",
        "Tree",
        "Graph",
        "Parent"
    ],
    answer: 2,
    explanation: "Hubungan tambahan tersebut membuat struktur tidak lagi memenuhi aturan Tree sehingga menjadi Graph."
}

];
