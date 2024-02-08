/*
 * DAM audio player javascript
 * 
 */
;(function (root, factory) {
  if (typeof define === 'function' && define.amd){
    define(factory);
  }
  else if (typeof exports === 'object') {
    module.exports = factory();
  }
  else {
    root.AudioPlayer = factory();
  }
}(window, function () {

  function AudioPlayer(root_elem) {
    this.container = root_elem;
    this.elem_id = root_elem.id;
    this.audio = this.container.querySelector('.audio-file');
    this.bufferedAmount = 0;
    this.currentTimeContainer = this.container.querySelector('.time.current-time');
    this.durationContainer = this.container.querySelector('.time.duration');
    this.muteButton = this.container.querySelector('.mute-button');
    this.muteState = 'unmuted';
    this.playButton = this.container.querySelector('.play-pause-button');
    this.playState = 'paused';
    this.progress = 0;
    this.raf = null;
    this.seekSlider = this.container.querySelector('.seek-slider');
    this.started = false;
    this.trackTitle = this.container.querySelector('.track-title').innerHTML;
    this.volumeContainer = this.container.querySelector('.volume-output');
    this.volumeSlider = this.container.querySelector('.volume-slider');
    this.mediaSession = false;
    this.metadata = null;
    this.loaded = false;

    this.init();
  }

  AudioPlayer.prototype.init = function(){
    var self = this; // make top-level this available in event listeners

    if (self.audio.readyState >= 2) {
      console.log('loaded');
      self.displayDuration();
      self.initSlider();
      //self.updateBuffer();
      this.loaded = true;
    }
    else {
      self.audio.addEventListener('loadedmetadata', function() {
        console.log('loadedmetadata');
        self.displayDuration();
        self.initSlider();
        //self.updateBuffer();
        this.loaded = true;
      });
    }

    self.seekSlider.addEventListener('input', function(e) {
      self.currentTimeContainer.textContent = self.calculateTime(self.seekSlider.value);
      self.showRangeProgress(e.target);
      if (!self.audio.paused) {
        cancelAnimationFrame(self.raf);
      }
    });

    self.seekSlider.addEventListener('change', function() {
      self.audio.currentTime = self.seekSlider.value;
      if (!self.audio.paused) {
        requestAnimationFrame(() => self.whilePlaying());
      }
    });

    //self.audio.addEventListener('progress', self.updateBuffer);

    self.volumeSlider.addEventListener('input', function(e) {
      const value = e.target.value;

      self.showRangeProgress(e.target);

      self.volumeContainer.textContent = value;
      self.audio.volume = value / 100;
    });

    self.muteButton.addEventListener('click', function() {
      self.toggleMute();
    });

    self.playButton.addEventListener('click', function() {
      if (self.playState === 'paused') {
        self.play();
      }
      else {
        self.pause();
      }
    });

    /* if Media Session API is available */
    if ('mediaSession' in navigator) {
      this.metadata = new MediaMetadata({
        title: this.container.querySelector('.track-title').textContent,
        artist: 'artist',
        album: 'album',
        artwork: [
          {src: 'https://someplace.somewhere.denverartmuseum.org/', sizes: '512x512', type: 'image/jpg'}
        ]
      });
    }

  };

  AudioPlayer.prototype.calculateTime = function(secs) {
    var hours = Math.floor(secs / 3600);
    var minutes = Math.floor((secs - (hours * 3600)) / 60);
    var seconds = Math.floor(secs % 60);
    var secondsString = seconds < 10 ? `0${seconds}` : `${seconds}`;
    if (hours > 0) {
      var minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;
      return `${hours}:${minutesString}:${secondsString}`;
    }
    else {
      return `${minutes}:${secondsString}`;
    }
  };

  AudioPlayer.prototype.displayDuration = function() {
    this.durationContainer.textContent = this.calculateTime(this.audio.duration);
  };

  AudioPlayer.prototype.gaEvent = function(eventName, eventValue = 0) {
    /*
    window.dataLayer.push({
      'event': 'Audio',
      'audioPlayerAction': eventName,
      'audioTitle': this.trackTitle
    });
    */
  };

  AudioPlayer.prototype.initSlider = function() {
    this.seekSlider.max = Math.floor(this.audio.duration);
  };

  AudioPlayer.prototype.pause = function () {
    this.audio.pause();
    this.playButton.classList.remove('playing');
    this.playButton.classList.add('paused');
    this.playState = 'paused';
    cancelAnimationFrame(this.raf); 
  };

  AudioPlayer.prototype.play = function() {
    window.damAudioPlayers.pauseAll(this);
    if (!this.loaded) {
      this.displayDuration();
      this.initSlider();
    }
    this.audio.play();
    this.playButton.classList.remove('paused');
    this.playButton.classList.add('playing');
    this.playState = 'playing';
    if (!this.started) {
      this.gaEvent('Play');
      this.started = true;
    }
    requestAnimationFrame(() => this.whilePlaying());
  };

  AudioPlayer.prototype.showRangeProgress = function(rangeInput) {
    var progress = rangeInput.value / rangeInput.max * 100;

    if (rangeInput === this.seekSlider) {
      this.container.style.setProperty('--seek-before-width', progress + '%');
    }
    else {
      this.container.style.setProperty('--volume-before-width', progress + '%');
    }

    if (this.progress < 25 && progress >= 25) {
      this.progress = 25;
      this.gaEvent('Reach 25%');
    }
    else if (this.progress < 50 && progress >= 50) {
      this.progress = 50;
      this.gaEvent('Reach 50%');
    }
    else if (this.progress < 75 && progress >= 75) {
      this.progress = 75;
      this.gaEvent('Reach 75%');
    }
    else if (this.progress < 90 && progress >= 90) {
      this.progress = 90;
      this.gaEvent('Reach 90%');
    }
    else if (this.progress < 100 && progress >= 100) {
      this.progress = 100;
      this.gaEvent('Reach 100%');
    }
  };

  AudioPlayer.prototype.toggleMute = function () {
      if (this.muteState === 'muted') {
        this.audio.muted = false;
        this.muteButton.classList.remove('muted');
        this.muteButton.classList.add('unmuted');
        this.muteState = 'unmuted';
      }
      else {
        this.audio.muted = true;
        this.muteButton.classList.remove('unmuted');
        this.muteButton.classList.add('muted');
        this.muteState = 'muted';
      }  
  };

  AudioPlayer.prototype.updateBuffer = function() {
    this.bufferedAmount = Math.floor(this.audio.buffered.end(this.audio.buffered.length - 1));
    this.container.style.setProperty('--buffered-width', `${(this.bufferedAmount / this.seekSlider.max) * 100}%`);
  };

  AudioPlayer.prototype.whilePlaying = function() {
    this.seekSlider.value = Math.floor(this.audio.currentTime);
    this.currentTimeContainer.textContent = this.calculateTime(this.seekSlider.value);
    this.container.style.setProperty('--seek-before-width', `${this.seekSlider.value / this.seekSlider.max * 100}%`);
    this.raf = requestAnimationFrame(() => this.whilePlaying());
  };

  function docReady(fn) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 200);
    }
    else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  docReady(function() {
    var containers = document.querySelectorAll('.audio-player-container');
    var players = [];

    if (containers.length > 0) {
      containers.forEach(function(container) {
        players.push(new AudioPlayer(container));
      });
    }

    window.damAudioPlayers = {
      'players': players,
      getPlayer: function(container) {
        var i = 0;
        for (i = 0; i < this.players.length; i++) {
          if (typeof container === 'string' && this.players[i].elem_id === container) {
            return this.players[i];
          }
          else if (typeof container === 'object' && this.players[i].container === container) {
            return this.players[i];
          }
          return false;
        }
      },
      pauseAll: function(container) {
        var i = 0;
        for (i = 0; i < this.players.length; i++) {
          if (typeof container === 'string' && this.players[i].elem_id != container) {
            this.players[i].pause();
          }
          else if (typeof container === 'object' && this.players[i].container != container) {
            this.players[i].pause();
          }
          else {
            this.players[i].pause();
          }
        }
      }
    };

  });
}));



