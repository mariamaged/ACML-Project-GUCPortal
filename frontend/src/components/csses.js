// // //lastTable
// // /* this demo is for the table-layout:auto algorithm. If you are using the table-layout:fixed algorithm then there are other methods to fix the header without js.*/
// // body{
// //     color:black
// // }
// // .testBody{
// //     color:black
// // }
// // th{
// //     color:black
// // }
// // .intro {
// // 	max-width:1280px;
// // 	margin:1em auto;
// // }
// // .table-scroll {
// // 	position: relative;
// // 	max-width: 1280px;
// //     width:100%;
    
// // 	margin: auto;
// // 	display:table;
// // }
// // .table-wrap {
// //     width: 100%;
// //     height:80%;
// // 	display:block;
// // 	overflow: auto;
// // 	position:relative;
// // 	z-index:1;
// // }


// //  .table-scroll td {
// // 	padding: 5px 10px;
// // 	border: 1px solid #000;
// // 	background: #fff;
// // 	vertical-align: top;
// // }
// // .table-scroll th{
// //     padding: 5px 10px;
// // 	border: 1px solid #000;
// // 	background: #fff;
// //     vertical-align: top;
// //     position: sticky; top: 0;
// // }

// // .table-scroll th, .table-scroll td {
// //     min-width: 100px;
// //     height: 25px;
// //     border: dashed 1px lightblue;
// //     overflow-y:hidden;
// //     text-overflow: ellipsis;
   
// // }
// // /* ie bug */


















// //newTables


// *{  
//     margin:0;
//     padding:0;
//     font-family:Lato;
//     background-color: darkkhaki;
//   }
  
//   body{
//     padding:0px;
//     background:#f6f3f7 - #111;
//   }
  
//   .flatTable{  
//     width:100%;
//     min-width:500px;
//     border-collapse:collapse;  
//     font-weight:bold;
//     color:darkgrey;
//   }
//     .flatTable tr{
//       height:50px;
//       background:#f6f3f7 - #222;
//       border-bottom:rgba(0,0,0,.05) 1px solid;
//     }
    
//     .flatTable td{    
//       box-sizing:border-box;
//       padding-left:30px;
      
//     }
  
//     .flatTable titleTr{
//     height:70px;  
//     color:#f6f3f7; 
//     background:#418a95;  
//     border:0px solid;
//       }
  
//       .flatTable plusTd{
//       background:url(https://i.imgur.com/3hSkhay.png) center center no-repeat, rgba(0,0,0,.1);
//       }
  
//       .flatTable controlTd{  
//     position:relative;
//     width:80px;
//     background:url(https://i.imgur.com/9Q5f6cv.png) center center no-repeat;
//     cursor:pointer;
//       }
  
//       .flatTable headingTr{
//       height:30px;
//       background:#418a95 + #222;
//       color:#f6f3f7; 
//       font-size:8pt;
//       border:0px solid;   
//       }  
  
  
//   .button{
//     text-align:center;
//     cursor:pointer;
//   }
  
//   .sForm{
//     position:absolute;
//     top:0;
//     right:-400px;
//     width:400px;
//     height:100%; 
//     background:#f6f3f7 - #222;  
//     overflow:hidden;  
//     transition:width 1s, right .3s;
//     padding:0px;
//     box-sizing:border-box;
//   }
//    .sForm close{
//       float:right; 
//       height:70px;
//       width:80px;
//       padding-top:25px;    
//       box-sizing:border-box;
//       background:rgba(255,0,0,.4);   
//     }
    
//     .sForm title{
//       width:100%;
//       height:70px;
//       padding-top:20px;
//       padding-left:20px;
//       box-sizing:border-box;
//       background:rgba(0,0,0,.1);
//     }
  
  
  
  
//   .open{  
//     right:0;
//     width:400px !important;
//   }
  
//   .settingsIcons{
//     position:absolute; 
//     top:0;
//     right:0;
//     width:0;
  
//     overflow:hidden;
  
//   }
  
//   .display{
  
//     width:300px;
//   }
  
//   .settingsIcon{
//     float:right; 
//     background: #418a95;
//     color:#f6f3f7;
//     height:50px;
//     width:80px;
//     padding-top:15px;
//     box-sizing:border-box;
//     text-align:center;
//     overflow:hidden;
//     transition:width 1s;
//   }
  
//   .settingsIcon:hover{
//     background:#418a95 - #222;
//   }
  
//   tr:nth-child(3)
//      .settingsIcon{
//       height:51px;
//     }
  
  
//   .openIcon{
//      width:80px; 
//   }




















//   //newTables
  
// *{  
//     margin:0;
//     padding:0;
//     font-family:Lato;
//     background-color:lightslategrey;
//   }

// .reqTable{
//     margin-right:1000px
    
// }
//  /* .reqBtn{
//     /* background-color: crimson;
//     color: darkmagenta; 
//     margin-right:1000px

// } */
// .container{
//     margin:0;
//     padding:0;
//     margin-right:10px;
//     background-color: lightslategrey;
//     width:100%;
//     overflow-y: auto;
// }

// .dropdown-container{
//     background-color: lightslategrey;
// }

// .center{
//     background-color: lightslategrey;
// }



// .reqTable {
//     border-collapse: collapse;
//     max-width: 600px;
// }
// th{
//     background-color: #EFEFEF;
// }
// th, tbody {
//     display: block;
// }
// tbody {
//     overflow-y: scroll;
//     height: 100vh;
// }
// td, th {
//     min-width: 100px;
//     height: 25px;
//     border: dashed 1px lightblue;
//     overflow-y:hidden;
//     text-overflow: ellipsis;
   
// }

  










// //reqTables
// body {
//     margin: 0;
//     font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
//       'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
//       sans-serif;
//     -webkit-font-smoothing: antialiased;
//     -moz-osx-font-smoothing: grayscale;
//   }
  
//   code {
//     font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
//       monospace;
//   }
  
  
  
//   @import 'https://fonts.googleapis.com/css?family=Open+Sans:600,700';
  
//   * {font-family: 'Open Sans', sans-serif;}
  
//   .rwd-table {
   
//     min-width: 300px;
//     max-width: 100%;
//     border-collapse: collapse;
//     margin-right:610px
//   }
  
//   .rwd-table tr:first-child {
//     border-top: none;
//     background: rgb(3, 10, 73) ;
//     color: rgb(8, 4, 4);
//   }
  
//   .rwd-table tr {
//     border-top: 1px solid #ddd;
//     border-bottom: 1px solid #ddd;
//     background-color: #f5f9fc;
//   }
  
//   .rwd-table tr:nth-child(odd):not(:first-child) {
//     background-color: #ebf3f9;
//   }
  
//   .rwd-table th {
//     display: none;
//   }
  
//   .rwd-table td {
//     display: block;
//   }
  
//   .rwd-table td:first-child {
//     margin-top: .5em;
//   }
  
//   .rwd-table td:last-child {
//     margin-bottom: .5em;
//   }
  
//   .rwd-table td:before {
//     content: attr(data-th) ": ";
//     font-weight: bold;
//     width: 120px;
//     display: inline-block;
//     color: #000;
//   }
  
//   .rwd-table th,
//   .rwd-table td {
//     text-align: left;
//   }
  
//   .rwd-table {
//     color: crimson;
//     border-radius: .4em;
//     overflow: hidden;
//     margin-left:50px
  
//   }
  
//   .rwd-table tr {
//     border-color: #bfbfbf;
//   }
  
//   .rwd-table th,
//   .rwd-table td {
//     padding: .5em 1em;
//   }
//   @media screen and (max-width: 601px) {
//     .rwd-table tr:nth-child(2) {
//       border-top: none;
//     }
//   }
//   @media screen and (min-width: 600px) {
//     .rwd-table tr:hover:not(:first-child) {
//       background-color: #d8e7f3;
//     }
//     .rwd-table td:before {
//       display: none;
//     }
//     .rwd-table th,
//     .rwd-table td {
//       display: table-cell;
//       padding: .25em .5em;
//     }
//     .rwd-table th:first-child,
//     .rwd-table td:first-child {
//       padding-left: 0;
//     }
//     .rwd-table th:last-child,
//     .rwd-table td:last-child {
//       padding-right: 0;
//     }
//     .rwd-table th,
//     .rwd-table td {
//       padding: 1em !important;
//     }
//   }
  
  
//   /* THE END OF THE IMPORTANT STUFF */
  
//   /* Basic Styling */
//   body {
//   background: #4B79A1;
//   background: -webkit-linear-gradient(to left, #4B79A1 , #283E51);
//   background: linear-gradient(to left, #4B79A1 , #283E51);        
//   }
//   h1 {
//     text-align: center;
//     font-size: 2em;
//     color: #f2f2f2;
//   }
//   .container {
//     display: block;
//     text-align: center;
//     margin-right:50px
//   }
//   h3 {
//     display: inline-block;
//     position: relative;
//     text-align: center;
//     font-size: 1.5em;
//     color: #cecece;
//   }
//   h3:before {
//     content: "\25C0";
//     position: absolute;
//     left: -50px;
//     -webkit-animation: leftRight 2s linear infinite;
//     animation: leftRight 2s linear infinite;
//   }
//   h3:after {
//     content: "\25b6";
//     position: absolute;
//     right: -50px;
//     -webkit-animation: leftRight 2s linear infinite reverse;
//     animation: leftRight 2s linear infinite reverse;
//   }
//   @-webkit-keyframes leftRight {
//     0%    { -webkit-transform: translateX(0)}
//     25%   { -webkit-transform: translateX(-10px)}
//     75%   { -webkit-transform: translateX(10px)}
//     100%  { -webkit-transform: translateX(0)}
//   }
//   @keyframes leftRight {
//     0%    { transform: translateX(0)}
//     25%   { transform: translateX(-10px)}
//     75%   { transform: translateX(10px)}
//     100%  { transform: translateX(0)}
//   }
  

  








//   //tables
//   h2 {
//     text-align: center;
//     padding: 20px 0;
//   }
  
//   .table-bordered {
//     border: 1px solid #ddd !important;
//   }
  
//   table caption {
//       padding: .5em 0;
//   }
  
//   @media screen and (max-width: 767px) {
//     table caption {
//       display: none;
//     }
//   }
  
//   .p {
//     text-align: center;
//     padding-top: 140px;
//     font-size: 14px;
//   }















// //  test3
// body {
//     padding-top: 50px;
//   }
  
//   .navbar {
//     height: 50px;
//     padding: 0 15px;
//     width: 100%;
//     position: fixed;
//     top: 0;
//     z-index: 1;
//   }
  
//   .navbar a {
//     color: white;
//     line-height: 3em;
//   }
  
//   .table-area {
//     position: relative;
//     z-index: 0;
//     margin-top: 50px;
//   }
  
//   table.responsive-table {
//     display: table;
//     /* required for table-layout to be used (not normally necessary; included for completeness) */
//     table-layout: fixed;
//     /* this keeps your columns with fixed with exactly the right width */
//     width: 100%;
//     /* table must have width set for fixed layout to work as expected */
//     height: 100%;
//   }
  
//   table.responsive-table thead {
//     position: fixed;
//     top: 50px;
//     left: 0;
//     right: 0;
//     width: 100%;
//     height: 50px;
//     line-height: 3em;
//     background: #eee;
//     table-layout: fixed;
//     display: table;
//     position: sticky; top: 0;
   
//         flex: 0 0 auto;
    
//   }


//   .header-fixed {
//     width: 100% 
// }

// table.responsive-table thead -fixed > thead,
// .header-fixed > tbody,
// .header-fixed > thead > tr,
// .header-fixed > tbody > tr,
// .header-fixed > thead > tr > th,
// .header-fixed > tbody > tr > td {
//     display: block;
// }

// .header-fixed > tbody > tr:after,
// .header-fixed > thead > tr:after {
//     content: ' ';
//     display: block;
//     visibility: hidden;
//     clear: both;
// }

// .header-fixed > tbody {
//     overflow-y: auto;
//     height: 150px;
// }

// .header-fixed > tbody > tr > td,
// .header-fixed > thead > tr > th {
//     width: 20%;
//     float: left;
// }





  
//   table.responsive-table th {
//     background: #eee;
//   }
  
//   table.responsive-table td {
//     line-height: 2em;
//   }
  
//   table.responsive-table tr > td,
//   table.responsive-table th {
//     text-align: left;
//   }




















//   //test4
//   /* Please Subscribe My Youtube Channel
// https://www.youtube.com/channel/UCQM5ye1xR4vJgtga0ryud2Q/
// */
// body{background:lightgray;
//     font-size: 16px;
//     line-height: 1.5.;

// }
// .panel-table .panel-body{
//   padding:0;
// }

// .panel-table .panel-body .table-bordered{
//   border-style: none;
//   margin:0;
// }

// .panel-table .panel-body .table-bordered > thead > tr > th:first-of-type {
//     text-align:center;
//     width: 100px;
// }

// .panel-table .panel-body .table-bordered > thead > tr > th:last-of-type,
// .panel-table .panel-body .table-bordered > tbody > tr > td:last-of-type {
//   border-right: 0px;
// }

// .panel-table .panel-body .table-bordered > thead > tr > th:first-of-type,
// .panel-table .panel-body .table-bordered > tbody > tr > td:first-of-type {
//   border-left: 0px;
// }

// .panel-table .panel-body .table-bordered > tbody > tr:first-of-type > td{
//   border-bottom: 0px;
// }

// .panel-table .panel-body .table-bordered > thead > tr:first-of-type > th{
//   border-top: 0px;
// }

// .panel-table .panel-footer .pagination{
//   margin:0; 
// }

// /*
// used to vertically center elements, may need modification if you're not using default sizes.
// */
// .panel-table .panel-footer .col{
//  line-height: 34px;
//  height: 34px;
// }

// .panel-table .panel-heading .col h3{
//  line-height: 30px;
//  height: 30px;
// }

// .panel-table .panel-body .table-bordered > tbody > tr > td{
//   line-height: 34px;
// }