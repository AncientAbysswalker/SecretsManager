// setTimeout(
//     () => {
//         changeRandomLetter(3, 'y');
//     },
//     setTimeout(
//         () => {
//             changeRandomLetter(4, 'y');
//         },
//         setTimeout(
//             () => {
//                 changeRandomLetter(5, 'y');
//             },
//             setTimeout(
//                 () => {
//                     changeRandomLetter(6, 'y');
//                 },
//                 setTimeout(
//                     () => {
//                         changeRandomLetter(7, 'y');
//                     },
//                     setTimeout(
//                         () => {
//                             changeRandomLetter(8, 'y');
//                         },
//                         setTimeout(() => {
//                             changeRandomLetter(1, 'y');
//                         }, 500)
//                     )
//                 )
//             )
//         )
//     )
// );

// function changeRandomLetter(index, letter) {
//     alert(9);
//     document.title = document.title.splice(index, 1, letter);
// }

// window.setTitle('newTitle');
setTimeout(() => {
    window.electronAPI.setTitle('newTitle');
}, 2000);
