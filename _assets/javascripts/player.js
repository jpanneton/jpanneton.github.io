const players = document.querySelectorAll('.audio-player');

function clickHandler () {
    const sound = this.querySelector('audio');
    const spinner = this.querySelector('.audio-player-spinner');

    if (sound.paused) {
      sound.play();
      spinner.classList.remove('audio-player-spinner-on');
      spinner.classList.remove('audio-player-spinner-off');
      spinner.offsetWidth; // Trigger reflow
      spinner.classList.add('audio-player-spinner-on');
    } else {
      sound.pause();
      sound.currentTime = 0;
      spinner.classList.add('audio-player-spinner-off');
    }
};

players.forEach((player) => {
  const sound = player.querySelector('audio');
  const spinner = player.querySelector('.audio-player-spinner');

  sound.onended = () => {
    spinner.classList.add('audio-player-spinner-off');
  };

  player.addEventListener('click', clickHandler);
});
