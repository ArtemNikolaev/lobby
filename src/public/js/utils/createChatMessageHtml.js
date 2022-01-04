export default ({ username, message, time }, className) => {
  return `
    <div class=${className}>
      <p class="chat-username">${username} at ${time}</p>
      <p class="chat-message">${message}</p>
    </div>
  `;
};
