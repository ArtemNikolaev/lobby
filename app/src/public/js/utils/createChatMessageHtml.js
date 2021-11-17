export default ({ username, message, date }, className) => {
  const time = date.split("T")[1].split(".")[0];

  return `
    <div class=${className}>
      <p class="chat-username">${username} in ${time}</p>
      <p class="chat-message">${message}</p>
    </div>
  `;
};
