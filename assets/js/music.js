// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PlAYER_STORAGE_KEY = "F8_PLAYER";
const heading = $('header h2');
const headingh5 = $('header h5');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  // (1/2) Uncomment the line below to use localStorage
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
      {
        name: "Anh thanh niên",
        singer: "HuyR",
        path: "./music/anh-thanh-nien.mp3",
        image: "./img/anh-thanh-nien.jpg",
      },
      {
        name: "Em là con thuyền cô đơn",
        singer: "Nguyễn Thái Học",
        path: "./music/em-la-con-thuyen-co-don.mp3",
        image: "./img/em-la-con-thuyen-co-don.jpg",
      },    
      {
        name: "Hãy xem là giấc mơ",
        singer: "Chu Bin",
        path: "./music/hay-xem-la-giac-mo.mp3",
        image: "./img/hay-xem-la-giac-mo.jpg",
      },    
      {
        name: "Ngắm hoa lệ rơi",
        singer: "Châu Khải Phong",
        path: "./music/ngam-hoa-le-roi.mp3",
        image: "./img/ngam-hoa-le-roi.jpg",
      },    
      {
        name: "Người lạ thoáng qua",
        singer: "Đinh Tùng Huy",
        path: "./music/nguoi-la-thoang-qua.mp3",
        image: "./img/nguoi-la-thoang-qua.jpg",
      },    
      {
        name: "Níu duyên",
        singer: "Lê Bảo Bình",
        path: "./music/niu-duyen.mp3",
        image: "./img/niu-duyen.jpg",
      },    
      {
        name: "Rồi tới luôn",
        singer: "Nal",
        path: "./music/roi-toi-luon.mp3",
        image: "./img/roi-toi-luon.jpg",
      },    
      {
        name: "Yêu là cưới",
        singer: "Phát Hồ X2X",
        path: ".//music/yeu-la-cuoi.mp3",
        image: "./img/yeu-la-cuoi.jpg",
      }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
           // (2/2) Uncomment the line below to use localStorage
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
      },
    
      render:function(){
        const htmls = this.songs.map((song,index) => {
          return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
              <div class="thumb"
                style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>                  
          `
        })
        playlist.innerHTML = htmls.join('');
      },
      definePropertíes: function() {
        Object.defineProperty(this, 'currentSong', {
          get: function() {
            return this.songs[this.currentIndex];
          }
        }
        )
      },
      handleEvents: function(){//hàm sử lý sự kiện
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //cd quay/dừng
        const cdThumbAnimate = cdThumb.animate([
          { transform: 'rotate(360deg)'}
        ],{
          duration: 10000,//10giaay
          iterations:Infinity
        })
        cdThumbAnimate.pause()
        
        document.onscroll = function () {//phóng to thu nhỏ
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const newCdWidth = cdWidth - scrollTop;
          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
          cd.style.opacity = newCdWidth / cdWidth;
        }
        playBtn.onclick = function(){//nút play/pause
          if (_this.isPlaying) {
            audio.pause();
          } else {
            _this.isPlaying = true;
            audio.play();
          }
        }
        //khi sog dc play 
        audio.onplay = function(){
          _this.isPlaying = true;
          player.classList.add('playing');
          cdThumbAnimate.play();
        }
             //khi sog dc play 
        audio.onpause = function(){
          _this.isPlaying = false;
          player.classList.remove('playing');
          cdThumbAnimate.pause();
        }
        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
          if (audio.duration) {
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
            progress.value = progressPercent;
            console.log(audio.currentTime, audio.duration);
          }
        }

        //xử lý khi tua
        progress.onchange = function(e){
          const seekTime = audio.duration / 100 * e.target.value;
          audio.currentTime = seekTime;
        }
        //khi next bài hát
        nextBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong()
          } else {
            _this.nextSong();
          }
          audio.play();
          _this.render();//render active bài hát
          _this.scrollActiveSong();
        }
        //khi prev bài hát
        prevBtn.onclick = function(e){
          if(_this.isRandom){
            _this.playRandomSong()
          } else {
            _this.prevSong();
          }
          audio.play();
          _this.render();
          _this.scrollActiveSong();
        }
        // xử lý bật tắt random
        randomBtn.onclick = function(){
          _this.isRandom = !_this.isRandom;
          randomBtn.classList.toggle("active",_this.isRandom);
        }
        //khi hết bài sẽ yuwj động chuyển bài
        audio.onended = function(){
          if (_this.isRepeat) {
            audio.play();
          } else {
            nextBtn.click();
          }
        }
        //xư lý phát lại bài hát
        repeatBtn.onclick = function(){
          _this.isRepeat = !_this.isRepeat;
          repeatBtn.classList.toggle("active",_this.isRepeat);
        }

        //Lắng nghe hành vi click playlist 
        playlist.onclick = function (e) {
          const songNode = e.target.closest(".song:not(.active)");
    
          if (songNode || e.target.closest(".option")) {
            // Xử lý khi click vào song
            // Handle when clicking on the song
            if (songNode) {
              _this.currentIndex = Number(songNode.dataset.index);
              _this.loadCurrentSong()
              _this.render();
              audio.play();
            }
    
            // Xử lý khi click vào song option
            // Handle when clicking on the song option
            if (e.target.closest(".option")) {
            }
          }
        };
      },


      loadCurrentSong: function(){      //load bài hát đầu tiên
        heading.textContent = this.currentSong.name;
        headingh5.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
      },

      scrollActiveSong: function(){ 
        setTimeout(() => {
          $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            // inline: 'nearest'
          })
        }, 300);
      },
      //next bài/ quay lại bài trc đó
      nextSong: function(){
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
          this.currentIndex = 0;
        }
        this.loadCurrentSong();
      },
      prevSong: function(){
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
      },
      
      loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
      },

      playRandomSong: function(){
        let newIndex
        do {//sẽ chạy ít nhất 1 lần
          newIndex = Math.floor(Math.random()*this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
      },
      start: function(){
        //dinhj nghia cac thuoc tinh trong objec
        this.definePropertíes();

        //Lắng nghe / xử lý các sự kiện (DOM event)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();
        //Render playlist
        this.render();
      }
  }
  
app.start()


