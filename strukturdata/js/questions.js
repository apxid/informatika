/*
==========================================
TREE & GRAPH QUIZ (SMP Level)
Developer : MB
Version : 1.1
==========================================
*/

const questions = [
    {
        question: "Titik utama atau folder paling atas pada struktur Tree disebut ....",
        image: "assets/tree.png",
        options: [
            "Leaf (Daun)",
            "Root (Akar)",
            "Parent (Orang Tua)",
            "Child (Anak)"
        ],
        answer: 1,
        explanation: "Root adalah titik/folder paling atas (posisi awal) pada struktur Tree."
    },
    {
        question: "Bagian Tree yang berada paling ujung dan tidak punya 'anak' lagi disebut ....",
        image: "assets/leaf.png",
        options: [
            "Root",
            "Parent",
            "Leaf",
            "Node"
        ],
        answer: 2,
        explanation: "Leaf (daun) adalah bagian paling ujung pada Tree yang tidak bercabang lagi."
    },
    {
        question: "Pada File Manager HP, 'Memori Internal' berada di posisi paling atas. Memori Internal ini berperan sebagai ....",
        image: "assets/folder.png",
        options: [
            "Leaf",
            "Root",
            "Child",
            "File"
        ],
        answer: 1,
        explanation: "Semua folder berada di dalam Memori Internal, jadi Memori Internal adalah Root (akar)-nya."
    },
    {
        question: "Folder 'Musik' menyimpan banyak lagu di dalamnya. Dalam struktur Tree, folder 'Musik' disebut ....",
        image: "assets/folder.png",
        options: [
            "Root",
            "Parent",
            "Leaf",
            "Graph"
        ],
        answer: 1,
        explanation: "Karena folder Musik membawahi/menyimpan file-file lagu, maka ia bertindak sebagai Parent (orang tua)."
    },
    {
        question: "File lagu 'Lagu_Favorite.mp3' berada di dalam folder Musik dan tidak bisa diisi file lain. File tersebut merupakan ....",
        image: "assets/music.png",
        options: [
            "Leaf",
            "Root",
            "Parent",
            "Graph"
        ],
        answer: 0,
        explanation: "File adalah ujung dari struktur folder (tidak punya anak lagi), sehingga disebut Leaf."
    },
    {
        question: "Aplikasi Google Maps menampilkan peta jalan yang saling terhubung antar kota. Struktur data yang paling cocok adalah ....",
        image: "assets/graph.png",
        options: [
            "Tree",
            "Graph",
            "Root",
            "Leaf"
        ],
        answer: 1,
        explanation: "Peta jalanan memiliki banyak jalur bolak-balik dan bercabang bebas, sehingga menggunakan Graph."
    },
    {
        question: "Jaringan pertemanan di media sosial (seperti Instagram atau WhatsApp) menggunakan contoh struktur ....",
        image: "assets/graph.png",
        options: [
            "Tree",
            "Graph",
            "Leaf",
            "Root"
        ],
        answer: 1,
        explanation: "Setiap orang bisa saling berteman dengan siapa saja secara bebas tanpa urutan atas-bawah, jadi berbentuk Graph."
    },
    {
        question: "Ciri utama dari struktur Tree yang membedakannya dengan Graph adalah ....",
        image: "assets/tree.png",
        options: [
            "Memiliki urutan bertingkat dari atas ke bawah (hierarki)",
            "Bisa terhubung secara acak bebas",
            "Tidak memiliki titik awal",
            "Selalu berbentuk lingkaran"
        ],
        answer: 0,
        explanation: "Tree memiliki struktur bertingkat (hierarki) seperti silsilah keluarga atau folder komputer."
    },
    {
        question: "Dalam struktur Graph, titik yang saling terhubung (seperti kota atau akun media sosial) disebut ....",
        image: "assets/graph.png",
        options: [
            "Node / Vertex",
            "Root",
            "Leaf",
            "Branch"
        ],
        answer: 0,
        explanation: "Titik-titik dalam Graph disebut Node atau Vertex, sedangkan garis penghubungnya disebut Edge."
    },
    {
        question: "Struktur data mana yang cocok untuk menggambarkan 'Silsilah Keluarga' (Kakek -> Orang Tua -> Anak)?",
        image: "assets/tree.png",
        options: [
            "Graph",
            "Tree",
            "Circle",
            "Random"
        ],
        answer: 1,
        explanation: "Silsilah keluarga punya urutan keturunan yang jelas dari atas ke bawah, sehingga menggunakan Tree."
    }
];
