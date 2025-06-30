class MinimalistMusicPlayer {
            constructor() {
                this.currentTrack = 0;
                this.isPlaying = false;
                this.currentTime = 0;
                this.duration = 263; // 4:23 in seconds
                this.volume = 70;
                this.isShuffleOn = false;
                this.repeatMode = 0; // 0: off, 1: all, 2: one
                
                this.tracks = [
                    { title: "Midnight Jazz", artist: "Smooth Collective", duration: 263 },
                    { title: "Coffee Shop Vibes", artist: "Lounge Masters", duration: 198 },
                    { title: "Sunday Morning", artist: "Chill Waves", duration: 245 },
                    { title: "Rainy Day Blues", artist: "Mellow Moods", duration: 187 },
                    { title: "Golden Hour", artist: "Sunset Strings", duration: 223 },
                    { title: "Urban Nights", artist: "City Sounds", duration: 201 }
                ];
                
                this.initializeElements();
                this.initializePlaylist();
                this.bindEvents();
                this.updateDisplay();
                this.startTimer();
            }
            
            initializeElements() {
                this.musicPlayer = document.getElementById('musicPlayer');
                this.vinylRecord = document.getElementById('vinylRecord');
                this.waveAnimation = document.getElementById('waveAnimation');
                this.trackTitle = document.getElementById('trackTitle');
                this.trackArtist = document.getElementById('trackArtist');
                this.playBtn = document.getElementById('playBtn');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.shuffleBtn = document.getElementById('shuffleBtn');
                this.repeatBtn = document.getElementById('repeatBtn');
                this.progressBar = document.getElementById('progressBar');
                this.progress = document.getElementById('progress');
                this.currentTimeEl = document.getElementById('currentTime');
                this.durationEl = document.getElementById('duration');
                this.volumeSlider = document.getElementById('volumeSlider');
                this.playlist = document.getElementById('playlist');
            }
            
            initializePlaylist() {
                this.tracks.forEach((track, index) => {
                    const item = document.createElement('div');
                    item.className = `playlist-item ${index === 0 ? 'active' : ''}`;
                    item.innerHTML = `
                        <div class="playlist-song-title">${track.title}</div>
                        <div class="playlist-song-artist">${track.artist}</div>
                    `;
                    item.addEventListener('click', () => this.selectTrack(index));
                    this.playlist.appendChild(item);
                });
            }
            
            bindEvents() {
                this.playBtn.addEventListener('click', () => this.togglePlay());
                this.prevBtn.addEventListener('click', () => this.previousTrack());
                this.nextBtn.addEventListener('click', () => this.nextTrack());
                this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
                this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
                this.progressBar.addEventListener('click', (e) => this.seek(e));
                this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
                
                document.addEventListener('keydown', (e) => {
                    if (e.code === 'Space') {
                        e.preventDefault();
                        this.togglePlay();
                    }
                });
            }
            
            togglePlay() {
                this.isPlaying = !this.isPlaying;
                this.playBtn.textContent = this.isPlaying ? '⏸' : '▶';
                
                if (this.isPlaying) {
                    this.vinylRecord.classList.add('spinning');
                    this.musicPlayer.classList.remove('paused');
                } else {
                    this.vinylRecord.classList.remove('spinning');
                    this.musicPlayer.classList.add('paused');
                }
            }
            
            toggleShuffle() {
                this.isShuffleOn = !this.isShuffleOn;
                this.shuffleBtn.classList.toggle('active', this.isShuffleOn);
            }
            
            toggleRepeat() {
                this.repeatMode = (this.repeatMode + 1) % 3;
                this.repeatBtn.classList.toggle('active', this.repeatMode > 0);
                
                const symbols = ['🔁', '🔄', '🔂'];
                this.repeatBtn.textContent = symbols[this.repeatMode];
            }
            
            previousTrack() {
                if (this.isShuffleOn && this.repeatMode !== 2) {
                    this.currentTrack = Math.floor(Math.random() * this.tracks.length);
                } else {
                    this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
                }
                this.selectTrack(this.currentTrack);
            }
            
            nextTrack() {
                if (this.repeatMode === 2) {
                    this.currentTime = 0;
                    return;
                }
                
                if (this.isShuffleOn) {
                    this.currentTrack = Math.floor(Math.random() * this.tracks.length);
                } else {
                    this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
                }
                this.selectTrack(this.currentTrack);
            }
            
            selectTrack(index) {
                this.currentTrack = index;
                this.currentTime = 0;
                this.duration = this.tracks[index].duration;
                this.updateDisplay();
                this.updatePlaylist();
                
                if (!this.isPlaying) {
                    this.togglePlay();
                }
            }
            
            updatePlaylist() {
                const items = this.playlist.querySelectorAll('.playlist-item');
                items.forEach((item, index) => {
                    item.classList.toggle('active', index === this.currentTrack);
                });
            }
            
            seek(e) {
                const rect = this.progressBar.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                this.currentTime = percent * this.duration;
                this.updateProgress();
            }
            
            setVolume(value) {
                this.volume = value;
                const volumeIcon = document.querySelector('.volume-icon');
                if (value == 0) {
                    volumeIcon.textContent = '🔇';
                } else if (value < 30) {
                    volumeIcon.textContent = '🔈';
                } else if (value < 70) {
                    volumeIcon.textContent = '🔉';
                } else {
                    volumeIcon.textContent = '🔊';
                }
            }
            
            updateDisplay() {
                const track = this.tracks[this.currentTrack];
                this.trackTitle.textContent = track.title;
                this.trackArtist.textContent = track.artist;
                this.durationEl.textContent = this.formatTime(this.duration);
                this.updateProgress();
            }
            
            updateProgress() {
                const percent = (this.currentTime / this.duration) * 100;
                this.progress.style.width = `${percent}%`;
                this.currentTimeEl.textContent = this.formatTime(this.currentTime);
            }
            
            formatTime(seconds) {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }
            
            startTimer() {
                setInterval(() => {
                    if (this.isPlaying) {
                        this.currentTime += 1;
                        if (this.currentTime >= this.duration) {
                            this.currentTime = 0;
                            this.nextTrack();
                        }
                        this.updateProgress();
                    }
                }, 1000);
            }
        }
        
        window.addEventListener('DOMContentLoaded', () => {
            new MinimalistMusicPlayer();
        });