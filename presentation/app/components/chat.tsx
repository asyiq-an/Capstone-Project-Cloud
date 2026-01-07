// 'use client';

// import { useState } from 'react';
// import { MessageSquareText, X } from 'lucide-react';

// export default function Chat() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition"
//         >
//           <MessageSquareText className="w-6 h-6" />
//         </button>
//       )}

//       {isOpen && (
//         <div className="w-80 h-96 bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden">
//           {/* Chat Header */}
//           <div className="flex items-center justify-between bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-3">
//             <span className="font-semibold">Ask Snatch AI</span>
//             <button onClick={() => setIsOpen(false)}>
//               <X className="w-5 h-5" />
//             </button>
//           </div>

//           {/* Chat Body */}
//           <div className="flex-1 p-3 overflow-y-auto text-sm">
//             <div className="bg-blue-500 p-2 rounded-lg mb-2">
//               Hello! I'm Snatch AI. I'll help you to decide on what food to buy. Just let me know what tastes or types of food you're feeling!
//             </div>
//           </div>

//           {/* Chat Input */}
//           <div className="bg-blue-500 border-t p-2 flex items-center">
//             <input
//               type="text"
//               placeholder="How may I help you?"
//               className="flex-1 p-2 border rounded-lg text-sm"
//             />
//             <button className="ml-2 text-green-500 hover:text-green-600">
//               Send
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
