const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');

if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('open');
  });
}

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  {
    // Large sections (like a long photo wall) may never reach high intersection ratios.
    threshold: 0.02,
    rootMargin: '0px 0px -8% 0px',
  }
);

reveals.forEach((el) => revealObserver.observe(el));

const farewellEndDate = new Date('2026-03-15T05:00:00+09:00');
const dayEl = document.getElementById('days');
const hourEl = document.getElementById('hours');
const minEl = document.getElementById('minutes');

const updateCountdown = () => {
  if (!dayEl || !hourEl || !minEl) return;
  const now = new Date();
  const diff = now.getTime() - farewellEndDate.getTime();

  if (diff <= 0) {
    dayEl.textContent = '0';
    hourEl.textContent = '0';
    minEl.textContent = '0';
    return;
  }

  const totalMinutes = Math.floor(diff / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  dayEl.textContent = String(days);
  hourEl.textContent = String(hours);
  minEl.textContent = String(minutes);
};

if (dayEl && hourEl && minEl) {
  updateCountdown();
  setInterval(updateCountdown, 30000);
}

const year = document.getElementById('year');
if (year) {
  year.textContent = String(new Date().getFullYear());
}

const fourthYearGallery = document.getElementById('photo-gallery-4th');
const thirdYearGallery = document.getElementById('photo-gallery-3rd');
const secondYearGallery = document.getElementById('photo-gallery-2nd');
const firstYearGallery = document.getElementById('photo-gallery-1st');
const day1Gallery = document.getElementById('photo-gallery-day1');
const day2MaharajaGallery = document.getElementById('photo-gallery-day2-maharaja');
const photoArchiveSection = document.getElementById('photoarchive');
const photoModal = document.getElementById('photo-modal');
const photoModalImage = document.getElementById('photo-modal-image');
const photoModalClose = document.getElementById('photo-modal-close');
const photoModalPrev = document.getElementById('photo-modal-prev');
const photoModalNext = document.getElementById('photo-modal-next');
const modalPhotos = [];
let currentModalPhotoIndex = -1;

const registerModalPhoto = (img) => {
  const existing = modalPhotos.indexOf(img);
  if (existing !== -1) return existing;
  modalPhotos.push(img);
  return modalPhotos.length - 1;
};

const openPhotoModalByIndex = (index) => {
  if (!photoModal || !photoModalImage) return;
  const target = modalPhotos[index];
  if (!target) return;
  currentModalPhotoIndex = index;
  photoModalImage.src = target.src;
  photoModalImage.alt = target.alt;
  photoModal.classList.add('open');
  photoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

const movePhotoModal = (step) => {
  if (!photoModal?.classList.contains('open') || modalPhotos.length === 0) return;
  const nextIndex = (currentModalPhotoIndex + step + modalPhotos.length) % modalPhotos.length;
  openPhotoModalByIndex(nextIndex);
};

const closePhotoModal = () => {
  if (!photoModal || !photoModalImage) return;
  photoModal.classList.remove('open');
  photoModal.setAttribute('aria-hidden', 'true');
  photoModalImage.src = '';
  currentModalPhotoIndex = -1;
  document.body.classList.remove('modal-open');
};

if (photoModalClose) {
  photoModalClose.addEventListener('click', closePhotoModal);
}

if (photoModalPrev) {
  photoModalPrev.addEventListener('click', (event) => {
    event.stopPropagation();
    movePhotoModal(-1);
  });
}

if (photoModalNext) {
  photoModalNext.addEventListener('click', (event) => {
    event.stopPropagation();
    movePhotoModal(1);
  });
}

if (photoModal) {
  photoModal.addEventListener('click', (event) => {
    if (event.target === photoModal) {
      closePhotoModal();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closePhotoModal();
    return;
  }
  if (!photoModal?.classList.contains('open')) return;
  if (event.key === 'ArrowLeft') {
    movePhotoModal(-1);
  } else if (event.key === 'ArrowRight') {
    movePhotoModal(1);
  }
});

const renderPhotoGallery = ({ gallery, photoCount, directory, altPrefix }) => {
  if (!gallery) return;
  for (let i = 1; i <= photoCount; i += 1) {
    const num = String(i).padStart(3, '0');
    const figure = document.createElement('figure');
    figure.className = 'photo-card';

    const img = document.createElement('img');
    img.src = `./assets/${directory}/${num}.jpg`;
    img.alt = `${altPrefix} ${i}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    const modalIndex = registerModalPhoto(img);
    img.addEventListener('click', () => openPhotoModalByIndex(modalIndex));

    figure.appendChild(img);
    gallery.appendChild(figure);
  }
};

const renderPhotoGalleryRange = ({
  gallery,
  start,
  end,
  directory,
  altPrefix,
  randomize = false,
}) => {
  if (!gallery) return;
  const numbers = [];
  for (let i = start; i <= end; i += 1) {
    numbers.push(i);
  }

  if (randomize) {
    for (let i = numbers.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
  }

  for (const i of numbers) {
    const num = String(i).padStart(3, '0');
    const figure = document.createElement('figure');
    figure.className = 'photo-card';

    const img = document.createElement('img');
    img.src = `./assets/${directory}/${num}.jpg`;
    img.alt = `${altPrefix} ${i}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    const modalIndex = registerModalPhoto(img);
    img.addEventListener('click', () => openPhotoModalByIndex(modalIndex));

    figure.appendChild(img);
    gallery.appendChild(figure);
  }
};

const renderPhotoPlaceholders = ({ gallery, count = 8, label = '写真を追加' }) => {
  if (!gallery) return;
  for (let i = 0; i < count; i += 1) {
    const figure = document.createElement('figure');
    figure.className = 'photo-card photo-card-placeholder';

    const text = document.createElement('span');
    text.className = 'photo-card-placeholder-text';
    text.textContent = label;

    figure.appendChild(text);
    gallery.appendChild(figure);
  }
};

let photoArchiveRendered = false;
const renderPhotoArchive = () => {
  if (photoArchiveRendered) return;
  photoArchiveRendered = true;

  renderPhotoGalleryRange({
    gallery: day1Gallery,
    start: 1,
    end: 117,
    directory: 'day1-futsal',
    altPrefix: 'DAY1 フットサル',
    randomize: true,
  });

  renderPhotoGalleryRange({
    gallery: day2MaharajaGallery,
    start: 1,
    end: 146,
    directory: 'day2-maharaja-archive',
    altPrefix: 'DAY2 マハラジャ祇園',
    randomize: true,
  });

  renderPhotoGalleryRange({
    gallery: fourthYearGallery,
    start: 1,
    end: 124,
    directory: 'photowall',
    altPrefix: '4回生',
    randomize: true,
  });

  renderPhotoGalleryRange({
    gallery: thirdYearGallery,
    start: 1,
    end: 102,
    directory: 'photowall-3rd',
    altPrefix: '3回生',
    randomize: true,
  });

  renderPhotoGalleryRange({
    gallery: secondYearGallery,
    start: 1,
    end: 338,
    directory: 'photowall-2nd',
    altPrefix: '2回生',
    randomize: true,
  });

  renderPhotoGalleryRange({
    gallery: firstYearGallery,
    start: 1,
    end: 80,
    directory: 'photoarchive-1st',
    altPrefix: '1回生',
    randomize: true,
  });
};

if (photoArchiveSection) {
  const photoArchiveObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        renderPhotoArchive();
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: '350px 0px',
      threshold: 0.01,
    }
  );
  photoArchiveObserver.observe(photoArchiveSection);
}

const graduateDisplayOrder = [
  '種谷響希',
  '久保田圭祐',
  '磯崎友希',
  '小玉拓未',
  '陣内海璃',
  '辻拓真',
  '長谷川斗空',
  '西田典立',
  '布山達也',
  '三浦航大',
  '木村遥輝',
  '園田響己',
  '荒岡美夢',
  '岩佐茅咲',
  '永樂心優',
  '奥原沙理',
  '大澤夏海',
  '小比賀華子',
  '島田紗千',
  '田中柚希',
  '堀内うらら',
  '成本茉莉',
  '成本茉',
];

const graduateOrderIndex = (name) => {
  const index = graduateDisplayOrder.indexOf(name);
  return index === -1 ? 999 : index;
};

const personalMovieGrid = document.getElementById('personal-movie-grid');
if (personalMovieGrid) {
  const graduateMovieNames = [
    '永樂心優',
    '成本茉莉',
    '西田典立',
    '辻拓真',
    '小比賀華子',
    '岩佐茅咲',
    '種谷響希',
    '三浦航大',
    '木村遥輝',
    '田中柚希',
    '園田響己',
    '大澤夏海',
    '奥原沙理',
    '久保田圭祐',
    '長谷川斗空',
    '布山達也',
    '磯崎友希',
    '小玉拓未',
    '堀内うらら',
    '陣内海璃',
    '荒岡美夢',
    '島田紗千',
  ];
  const personalMovieSources = {
    永樂心優: 'assets/movies/eiraku-miyu.mp4',
    成本茉莉: 'assets/movies/narimoto-matsuri.mp4',
    西田典立: 'assets/movies/nishida-norisato.mp4',
    辻拓真: 'assets/movies/tsuji-takuma.mp4',
    小比賀華子: 'assets/movies/kobiga-hanako.mp4',
    岩佐茅咲: 'assets/movies/iwasa-chisaki.mp4',
    荒岡美夢: 'assets/movies/araoka-miyu.mp4',
    園田響己: 'assets/movies/sonoda-hibiki.mp4',
    大澤夏海: 'assets/movies/osawa-natsumi.mp4',
    久保田圭祐: 'assets/movies/kubota-keisuke.mp4',
    長谷川斗空: 'assets/movies/hasegawa-toa.mp4',
    種谷響希: 'assets/movies/tanetani-hibiki.mp4',
    磯崎友希: 'assets/movies/isozaki-yuki.mp4',
    三浦航大: 'assets/movies/miura-kota.mp4',
    木村遥輝: 'assets/movies/kimura-haruki.mp4',
    田中柚希: 'assets/movies/tanaka-yuzuki.mp4',
    島田紗千: 'assets/movies/shimada-sachi.mp4',
    布山達也: 'assets/movies/nunoyama-tatsuya.mp4',
    奥原沙理: 'assets/movies/okuhara-sari.mp4',
    小玉拓未: 'assets/movies/kodama-takumi.mp4',
    堀内うらら: 'assets/movies/horiuchi-urara.mp4',
    陣内海璃: 'assets/movies/jinnai-kairi.mp4',
  };
  const personalMovieSongs = {
    永樂心優: '夏は巡る',
    成本茉莉: 'heart2heart',
    西田典立: 'ようかい体操第一',
    辻拓真: '水曜日のダウンタウンOP',
    小比賀華子: '会いにKiTE!',
    岩佐茅咲: 'JAM',
    種谷響希: 'Super Ocean man',
    三浦航大: 'デッドマンズチェイス',
    木村遥輝: 'ワンドリンク別',
    田中柚希: 'もうすぐ大人になっちゃうから',
    園田響己: 'トリコ',
    大澤夏海: '愛でした。',
    奥原沙理: '常識の範疇',
    久保田圭祐: 'タマシイレボリューション',
    長谷川斗空: 'はちゃめちゃわちゃライフ！',
    布山達也: '完全感覚Dreamer',
    磯崎友希: '突破口',
    小玉拓未: 'はじまり',
    堀内うらら: 'エッジワース・カイパーベルト',
    陣内海璃: 'imagine if',
    荒岡美夢: 'Shout to My Ex',
    島田紗千: '君の目も鼻も口も顎も眉も寝ても覚めても超素敵!!!',
  };

  graduateMovieNames.sort((a, b) => graduateOrderIndex(a) - graduateOrderIndex(b));

  graduateMovieNames.forEach((name) => {
    const card = document.createElement('article');
    card.className = 'movie-slot-card';

    const title = document.createElement('h4');
    title.textContent = name;
    const song = document.createElement('p');
    song.className = 'movie-song';
    song.textContent = `曲名: ${personalMovieSongs[name] || '未入力'}`;
    if (name === '久保田圭祐') {
      song.classList.add('movie-song-nowrap');
    }

    let slot;
    if (personalMovieSources[name]) {
      slot = document.createElement('video');
      slot.className = 'movie-slot-video';
      slot.controls = true;
      slot.preload = 'metadata';
      slot.src = personalMovieSources[name];
    } else {
      slot = document.createElement('div');
      slot.className = 'movie-slot-placeholder';
      slot.textContent = 'ここに個人ムービーを追加';
    }

    card.appendChild(title);
    card.appendChild(song);
    card.appendChild(slot);
    personalMovieGrid.appendChild(card);
  });
}

const graduateProfiles = document.getElementById('graduate-profiles');
if (graduateProfiles) {
  const graduates = [
    {
      name: '永樂心優',
      nickname: 'みゅ、来年もやれる。',
      university: '同志社女子大学　表象文化学部',
      birthdate: '2003.6.11',
      description:
        '「みゅ、やれる。」この最強ミームの生みの親。つぶから中の永樂さんのサブ垢ストーリーは必見。フォロー必須。普段のストーリーもちゃんと面白い。Anfiniでは「ジャンカラでよく会う先輩」の類ではあるけど、意外と素飲みもしてくれたり。めちゃくちゃ話しやすくて本当に優しい。時にはテニサーとの架け橋なったり、時にはジャンカラの情報を流してくれたり。果たしてこの人を超えるつぶから愛好者は現れるのか。「永遠に楽（樂）しむ」と書いて永樂、来年も楽しみましょう。',
      photos: [
        'assets/graduates/eiraku-1.jpg',
        'assets/graduates/eiraku-2.jpg',
        'assets/graduates/eiraku-3.jpg',
      ],
    },
    {
      name: '成本茉莉',
      nickname: '香川県産　No.1陽キャうんぴす',
      university: '同志社大学　政策学部',
      birthdate: '2003/10/20',
      description:
        '香川が産んだ最強陽キャ。💩と酒が好き。うんぴすってなんだ。とりあえず飲めそうな人をかき集め、存分に飲ませ自分も楽しみまくる生粋の外向型。寝ようと思った時のつぶから鬼電話で頭を抱えた経験は誰しもあるはず。誰よりも酒と友人、サークルを愛し、誰よりも飲み会を楽しむ姿から、どの代からも絶対的な人気を誇ってました。ドライブでも飲み会でも旅行でもこの人さえいれば必ず盛り上がる安心感はハンパない。「記憶ない」で許されるのはこの人の特権。なんか来年もたくさん京都来てる気がする、大期待してます。',
      photos: [
        'assets/graduates/narimoto-1.jpg',
        'assets/graduates/narimoto-2.jpg',
        'assets/graduates/narimoto-3.jpg',
      ],
    },
    {
      name: '西田典立',
      university: '京都大学経済学部',
      birthdate: '2002.11.08',
      nickname: '七潰八飲',
      description:
        'アンフィニ28thの父。全てはこの1人の男から始まったと言われている。ここまで28thが大所帯である原点はにしてんなのかもしれない。サッカーでは初心者ながら経験者さながらのビックセーブを連発し、飲みの場では人に笑いと迷惑を人一倍かけまくる。誰しもが腹と頭を抱えました。爆飲み奇行からの二日酔いは合宿の風物詩。二日酔いで会社に行く姿は容易く想像できます。会社の飲み会でやらかしてクビにならないように。その姿は再び京都で見せてください。',
      photos: [
        'assets/graduates/nishida-1.jpg',
        'assets/graduates/nishida-2.jpg',
        'assets/graduates/nishida-3.jpg',
      ],
    },
    {
      name: '辻拓真',
      university: '京都大学教育学部',
      birthdate: '2003.05.22',
      nickname: 'お笑いクリエイター',
      description:
        'Anfini28thのお笑い怪獣。数々の笑いを生み出してきた28th随一のボケ担当。とんでもない角度から繰り出される発言と行動は再現不可能。28thのマネさんのとんでもないポテンシャルを一気に引き出したのもこの人の力が大きいはず。サッカーもぬるぬるドリブルで相手を剥がしすごく楽しそうだったのが印象的。実はめちゃくちゃ優しいし、こんだけ面白い人が笑ってくれて楽しんでくれると自己肯定感上がります。絶対に笑わかしてくれる男、社長になってもたまにはアホみたいに飲んでアホみたいに笑いましょう。',
      photos: [
        'assets/graduates/tsuji-1.jpg',
        'assets/graduates/tsuji-2.jpg',
        'assets/graduates/tsuji-3.jpg',
      ],
    },
    {
      name: '小比賀華子',
      university: '同志社大学文学部',
      birthdate: '2004.01.16',
      nickname: 'Anfini最高傑作',
      description:
        'Anfini最高傑作。この人は本当にすごい。シラフでは可愛いゆるキャラ。何喋ってもみんなを笑顔にできる愛されマスコット。そんなおびびん、お酒が入るとすごいです。圧倒的なタンクの持ち主だが、酔うと一気に呂律が回らず、何言ってるのかわからなくなり、数々の爆笑を生み出してくれました。行動は常に想像の斜め上、人を傷つけずに笑わせてくれる、誰にも真似できない天才。心の底から優しく素直で、誰からも愛され続けたみんなのおびびん。まだまだずっと京都にいてください。',
      photos: [
        'assets/graduates/kobiga-1.jpg',
        'assets/graduates/kobiga-2.jpg',
        'assets/graduates/kobiga-3.jpg',
      ],
    },
    {
      name: '岩佐茅咲',
      university: '同志社女子大学　現代社会学部',
      birthdate: '2003.10.15',
      nickname: 'チー。ー可愛さの秘訣についてー',
      description:
        'ちー。この響めちゃめちゃ好きでした。ふわふわキャラなイメージでたまに全体イベントに来てくれるときの喜びはすごかったです。同期からも後輩マネからもめちゃめちゃ愛されているちーさんを見て、実は「もっともっと仲良くなりたかったな」っていうのが本音でした。。心残りもありますので、来年ぜひ京都残留組と一緒に飲み会行きましょう！',
      photos: [
        'assets/graduates/iwasa-1.jpg',
        'assets/graduates/iwasa-2.jpg',
        'assets/graduates/iwasa-3.jpg',
      ],
    },
    {
      name: '種谷響希',
      university: '京都大学理学部',
      birthdate: '2003.11.29',
      nickname: 'アンストッパブルな熱血キャプテン',
      photos: [
        'assets/graduates/tanetani-1.jpg',
        'assets/graduates/tanetani-2.jpg',
        'assets/graduates/tanetani-3.jpg',
      ],
      description:
        '言わずと知れたAnfini28thの会長。ホームベース顔が特徴的。「京大のルカク」との異名も持つ。コイツはサッカーでも飲み会でも止められない。サッカーではフィジカルで縦突破。打って変わって飲み会では目パキ。宴会で戦えない奴にはブチギレ。とにかくアンストッパブルなやつでした。誰も予測しない角度からのボケと、歯に布着せぬストレートな発言に戸惑う面々も多いかもしれないが、こいつはいい奴。みんなの先頭に立ってはしゃぐ姿、サークルのことを考えすぎて悩む姿、色々見てきましたが、この背中についてきて本当に良かったです。新たな会長像を築き上げた熱血キャプテン、来年からも暴れてくれ。',
    },
    {
      name: '三浦航大',
      university: '京都大学法学部',
      birthdate: '2002.04.13',
      nickname: '重すぎる体、軽すぎる口',
      description:
        '大きな声と大きな体、手数の多いボケと瞬時のツッコミで圧倒的な存在感を誇るビックボス。どのメンバーでも笑いを生み出す生粋の関西人。彼がいる遊びや飲みは安心感がバツグンです。特技は情報収集とスピーカー。Anfiniのフライデー。全員口を揃えて三浦くんは口が軽いというが、なぜか情報が三浦くんに流れてる。なんでやねん。それだけの話術と人を集める力を持つ彼は、弁護士の卵でもある。偉大な先輩の背中を見ながら苦悩する姿は、面白くもありかっこ良くもありました。常にAnfiniの中心にいたイベ専ビックボス、来年の新歓も頑張ろう。',
      photos: [
        'assets/graduates/miura-1.jpg',
        'assets/graduates/miura-2.jpg',
        'assets/graduates/miura-3.jpg',
      ],
    },
    {
      name: '木村遥輝',
      university: '京都大学工学部',
      birthdate: '2003.09.08',
      nickname: '顎の先までサークル愛',
      description:
        'Anfini28thの天才プロデューサー。圧倒的なお笑いセンスと圧巻の企画力でAnfini全体を巻き込んでたくさんの思い出を生み出してくれました。はるくんの企画に参加したメンバーからの口コミは必ず最高評価で、先輩からも一目置かれる絶対的な存在でした。ボケで笑いを生みせるし、ツッコミスピードも超早い。何ができないんだろう。近頃はお仕事が大変そうで、かつてほどの活動量は見られませんが、期待しながら誘いを待ってるメンバー死ぬほど多いはず。気が向いたらいつでも呼んでください、多分誰もが飛んでいきます。',
      photos: [
        'assets/graduates/kimura-1.jpg',
        'assets/graduates/kimura-2.jpg',
        'assets/graduates/kimura-3.jpg',
      ],
    },
    {
      name: '田中柚希',
      university: '同志社大学商学部',
      birthdate: '2004/01/03',
      nickname: '後輩マネの参考書 ～教えて 酔い方 潰れ方～',
      description:
        'Anfini28th のマネ長の一人。ボケ拾いの参考書。一緒にいたら絶対ツッコんでくれるしどんな発言も見逃さない全プレの相方。先輩、同期、後輩問わず圧倒的な信頼を集め、企画者はまずこの方の予定の確保に走る。なにわ節全開のハスキーボイスも特徴的。ただ一度お酒が入るとこの人はまた一味違う。誰よりも楽しそう。ドアも壊せるぐらいには跳ねて、草むらにもツッコんだりしちゃう。とにかく人を笑顔にできる万能マネージャー。これだけの魅力を持つので当然モテ女。多くの男を魅了してきたみたいです。社会人のストレスを、飲んで跳ねて発散する姿を京都で見せてくれたら嬉しいです。',
      photos: [
        'assets/graduates/tanaka-1.jpg',
        'assets/graduates/tanaka-2.jpg',
        'assets/graduates/tanaka-3.jpg',
      ],
    },
    {
      name: '園田響己',
      university: '同志社大学商学部',
      birthdate: '2004/03.04',
      nickname: 'お世話になりました。',
      description:
        'Anfini28thのマネ長の1人。一回生の初期から今に至るまでずっとサークルの最前線で遊び続け、激動28thの歴史を全て見てきた人物。学年問わず幅広い層に呼ばれ続けて早4年がたち、しれっと5年目を迎えようとしている。面倒見の良い性格と誰とでも気さくに話すコミュニケーション能力は後輩からの支持を集めてます。また、どれだけイジられてもさらっと流す能力は超一流。たまには直撃させてやりたい。来年は卒業生と現役生を繋ぐ架け橋としてのポジションをお願いしたいです。',
      photos: [
        'assets/graduates/sonoda-1.jpg',
        'assets/graduates/sonoda-2.jpg',
        'assets/graduates/sonoda-3.jpg',
      ],
    },
    {
      name: '大澤夏海',
      university: '同志社女子大学',
      birthdate: '2003.12.16',
      nickname: '乾杯の数だけ涙がある',
      description:
        '28thマネの長女。視野の広さと細かなところへの気遣いは誰も真似できない腕前。圧巻のトーク力と面倒見の良さから、同期からも後輩からも慕われる最強姉御。それが顕著に現れるのがつぶから時。コップと全体を見渡し、瞬時の判断で部屋とドリ場を往来する彼女は、世代No.1ドリンカーの名を誇る。そんな彼女は涙もろい一面も。酔った時の泣き芸は十八番。人想いな性格が、酔うと前面に押し出されてしまい、涙が止まらない。年々涙腺が緩くなっているっぽいですが、後輩からしたら嬉しいことです。必ずやまた面倒見に来てくださいね。',
      photos: [
        'assets/graduates/osawa-1.jpg',
        'assets/graduates/osawa-2.jpg',
        'assets/graduates/osawa-3.jpg',
      ],
    },
    {
      name: '奥原沙理',
      university: '同志社大学商学部',
      birthdate: '2003/11/19',
      nickname: 'NGなしの爆音爆笑ねき',
      description:
        'とにかく笑ってる。ずっと笑ってる。さりさんがいれば、飲み会途中合流でもすぐどの席なのかすぐ分かる。それでいてNG0の体当たり芸は一級品。酔ってハイになった時の伝説の動画の数々は後世まで伝えていきたいと強く思います。普段はゲラな優しい先輩、酔ったら超ゲラな面白い先輩。後輩苦手とかよくゆーてましたが、後輩からの人気は根強く、しっかり慕われてました。自分も周りも笑いが絶えない天才マネージャー、必ずまた飲み一緒に行きましょう、後輩の名前と顔、一年以内は覚えててね。。。',
      photos: [
        'assets/graduates/okuhara-1.jpg',
        'assets/graduates/okuhara-2.jpg',
        'assets/graduates/okuhara-3.jpg',
      ],
    },
    {
      name: '久保田圭祐',
      university: '京都大学工学部',
      birthdate: '2002.05.15',
      nickname: '鋼鉄の肝臓・黄金の左足',
      description:
        'Anfini28thの副会長。サークルにいていいレベルではないサッカーのうまさ。幾度となく新歓に来た一回生の心を折っては、勝利の立役者となったスーパーエース。また、サッカー強豪校で育った男の肝臓も伊達ではない。サッカーと同じ熱量で、必ず最後まで宴会で戦い続ける戦士。コールの声はサッカーのコーチングより大きい。いつ卒業するのかは、周りにも本人にもわからない？',
      photos: [
        'assets/graduates/kubota-1.jpg',
        'assets/graduates/kubota-2.jpg',
        'assets/graduates/kubota-3.jpg',
      ],
    },
    {
      name: '長谷川斗空',
      university: '京都大学医学部',
      birthdate: '2003.09.19',
      nickname: '＃ゲロかわ系',
      description:
        '28thプレ1の可愛さと汚さ。矛盾。あれだけ吐いてキモ行動をして、先輩・後輩マネから可愛いと言われるのはAnfini七不思議の一つ。真っ白スベスベ肌と二郎で作り上げた丸い体が勝因か。とにかくこの4年間、ラーメンを啜り、タバコを吸い、金を掛けて、ゲロを吐く、のサイクルを一貫し続けた。ドライブや飲みでは無口で汚い行動ばかりなのに、なぜかそれを見たくなる根っからの愛されキャラ。まさかの卒業を果たし、ショックを受けた後輩も多いはず。でも大丈夫。度々京都に帰ってきて東京と社会の悪口を言って、今までと同じく飲んで吐く姿を来年も見れるはず。果たして社会に順応できるのか。。。',
      photos: [
        'assets/graduates/hasegawa-1.jpg',
        'assets/graduates/hasegawa-2.jpg',
        'assets/graduates/hasegawa-3.jpg',
      ],
    },
    {
      name: '布山達也',
      university: '京都大学法学部',
      birthdate: '2002.04.08',
      nickname: '完全豪飲ドライバー',
      description:
        'みんなのアニキ。大好きなのはお酒とギャンブル。言わずと知れた漢気MAXの大酒豪。達也くんがおる飲み会のテーマは大体喋ることよりも飲むこと。一升瓶を片手に宴会場をうろうろする姿は誰かのトラウマになっているかも。打って変わって普段の生活とサッカーでの安心感はレベチです。面倒見の良さは28thプレ随一で、超優しくて喋りやすい。右SBは鉄壁。圧倒的なフィジカルと走力で京大カップ連覇を支えた選手です。京都在住を滑り込みで決めたたつニキ、またいつでも爆飲み企画待ってます。',
      photos: [
        'assets/graduates/nunoyama-1.jpg',
        'assets/graduates/nunoyama-2.jpg',
        'assets/graduates/nunoyama-3.jpg',
      ],
    },
    {
      name: '磯崎友希',
      university: '京都大学理学部',
      birthdate: '2003.08.23',
      nickname: '金なし・地位なし・人気あり',
      description:
        '28thの弱者男性。口癖は「金がない」で、敬語を使う後輩は少ない。扱われ方は雑で不憫なことも起こりがち。それでも後輩人気は圧倒的。プレマネ問わない接しやすさと根の優しさからどの遊びや飲みにも候補としてあがる。彼曰く、トガらず丸くなったのがデカかったらしい。参考までに。気を遣わないし、気を遣わなくていいところが彼のいいところ。なんかおもろくなりそう、という安心感はすごかったです。漢気もよく勝ってくれるし！そんなともき君は来年も健在で人気をかき集めることでしょう。',
      photos: [
        'assets/graduates/isozaki-1.jpg',
        'assets/graduates/isozaki-2.jpg',
        'assets/graduates/isozaki-3.jpg',
      ],
    },
    {
      name: '小玉拓未',
      university: '京都大学理学部',
      birthdate: '2003.10.13',
      nickname: 'ノーベル合宿賞受賞',
      description:
        'Anfini28thの合宿長。圧巻の計画性と優しさで全プレ全マネからの信頼を掴み、最高の合宿を開催してくれました。28th恒例の回生合宿も主導してるらしく、4回になってまで毎年回生旅行をする素敵な代になったのもたくみくんの活躍が大きいと思ってます。一方、酒強28thの中では珍しくビール一杯で顔が真っ赤になる男。酒雑魚後輩からしたら結構助かってました。そんな安心感・信頼感フルマックスのたくみくんは勉学の方も一級品で、未来のノーベル賞博士。言い過ぎや！と謙虚に言ってそうですが、本当に学力すごいです。まだまだ京都生活長いと思います、いつでも飲みに行きましょう。',
      photos: [
        'assets/graduates/kodama-1.jpg',
        'assets/graduates/kodama-2.jpg',
        'assets/graduates/kodama-3.jpg',
      ],
    },
    {
      name: '堀内うらら',
      university: '同志社女子大学　看護学部',
      birthdate: '2003.4.12',
      nickname: '飲み干す横顔が好きでした。',
      description:
        'Anfini屈指、いや日本屈指の容姿端麗美女。通称うらぽり。Anfiniの遊びで見かけることは数少なく、それもまた魔性の女感が醸し出されていた要因の一つ。正直いうと、もっともっとAnfiniの遊びでお見えになりたかったです。後輩みんなからの総意。うららさんから認知をもらってるやつは羨ましい。飲みのグルでうららさんいるやんって思ったら、だいたいつぶから。コップを飲み干す横顔が絵になる人。意外と気さくで話しやすかったりもして最強の女性です。',
      photos: [
        'assets/graduates/horiuchi-1.jpg',
        'assets/graduates/horiuchi-2.jpg',
        'assets/graduates/horiuchi-3.jpg',
      ],
    },
    {
      name: '陣内海璃',
      university: '京都大学法学部',
      birthdate: '2003.02.18',
      nickname: 'お幸せに。',
      description:
        '京大生の目指すべき姿。高身長に、整った顔。抜群のトーク力と大人の余裕感。かいりくんみたいになりたいとよく思います。遊ぶときは遊ぶ、やるときはやる。社会に出ても超充実した人生が待っているはず、ちょっと分けて。何よりSNSで拝見できる彼女さんとのデート写真はもはや夫婦のようで、誰もが羨む美男美女カップル。本当に末長くお幸せにしてください。垢抜けたいプレイヤー諸君、目指すべきは陣内だ。',
      photos: [
        'assets/graduates/kairi-1.jpg',
        'assets/graduates/kairi-2.jpg',
        'assets/graduates/kairi-3.jpg',
      ],
    },
    {
      name: '荒岡美夢',
      university: '京都産業大学　現代社会学部',
      birthdate: '2003.04.05',
      nickname: '私を飲ませてごらんなさい',
      description:
        '華々しさと面白さを兼ね備えたカリスママネージャー。海外旅行も国内ドライブもこの方が被写体ならば全てが様になるほとんどインスタグラマー。飲み会中のトークでは誰もが引き摺り込まれ、またご一緒できることを切望する。一度でも憧れを抱いた後輩は数え切れないはず。大人思考を持ち合わせ、発する言葉は勉強になるため、メモは必須。社会に出ても必ず人を魅了するキャリアウーマンになるに違いない、絶対なってください。',
      photos: [
        'assets/graduates/araoka-1.jpg',
        'assets/graduates/araoka-2.jpg',
        'assets/graduates/araoka-3.jpg',
      ],
    },
    {
      name: '島田紗千',
      university: '同志社大学商学部',
      birthdate: '2003.08.20',
      nickname: '天真爛漫愛され歌姫',
      description:
        '一度話すと「さちワールド」に引きずり込まれ、誰しも心が穏やかになっていく、”天真爛漫”の言葉を欲しいままにした28th屈指の天然マネージャー。ほんわかした雰囲気とたまに出る謎発言で全員のハートをキャッチする。それでいて邦ロックオタクなのもまた良いんです。先輩後輩、同期問わず愛されるさちさんが同じ遊びにいたら気分はルンルン。音程外しながらも楽しそうに歌う姿、可愛かったなあ。',
      photos: [
        'assets/graduates/shimada-1.jpg',
        'assets/graduates/shimada-2.jpg',
        'assets/graduates/shimada-3.jpg',
      ],
    },
  ];

  graduates.sort((a, b) => graduateOrderIndex(a.name) - graduateOrderIndex(b.name));

  const graduatePhotoPositions = {
    成本茉莉: ['50% 36%', '50% 32%', '50% 34%'],
    田中柚希: ['50% 28%', '50% 34%', '50% 33%'],
    堀内うらら: ['50% 30%', '50% 31%', '50% 33%'],
    園田響己: ['50% 30%', '50% 32%', '50% 34%'],
    大澤夏海: ['50% 30%', '50% 32%', '50% 35%'],
    木村遥輝: ['50% 30%', '50% 32%', '50% 30%'],
    種谷響希: ['50% 33%', '50% 31%', '50% 32%'],
    布山達也: ['50% 30%', '50% 31%', '50% 29%'],
    久保田圭祐: ['50% 28%', '50% 30%', '50% 31%'],
    島田紗千: ['50% 31%', '50% 32%', '50% 31%'],
  };
  const femaleGraduateNames = new Set([
    '永樂心優',
    '成本茉莉',
    '小比賀華子',
    '岩佐茅咲',
    '田中柚希',
    '園田響己',
    '大澤夏海',
    '奥原沙理',
    '堀内うらら',
    '荒岡美夢',
    '島田紗千',
  ]);

  const normalizeBirthdate = (value) => {
    if (!value) return '未入力';
    const text = String(value).trim();
    const parts = text.split(/[^\d]+/).filter(Boolean);
    if (parts.length === 3 && parts[0].length === 4) {
      const [year, month, day] = parts;
      return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
    }
    return text;
  };

  graduates.forEach((graduate, index) => {
    const card = document.createElement('article');
    card.className = 'graduate-profile';
    card.classList.add(index % 2 === 0 ? 'is-normal' : 'is-reverse');
    const nicknameClass = femaleGraduateNames.has(graduate.name)
      ? 'graduate-nickname-female'
      : 'graduate-nickname-male';
    const noWrapNicknameClass = graduate.name === '田中柚希' ? 'graduate-nickname-nowrap' : '';

    const photoSlots = [0, 1, 2]
      .map((index) => {
        const photoSrc = graduate.photos?.[index];
        const photoPosition = graduatePhotoPositions[graduate.name]?.[index] || '50% 32%';
        if (!photoSrc) {
          return `<div class="graduate-photo-slot">写真${index + 1}を貼る</div>`;
        }
        return `
          <div class="graduate-photo-slot has-image">
            <img src="${photoSrc}" alt="${graduate.name}の写真${index + 1}" loading="lazy" style="--photo-position: ${photoPosition};" />
          </div>
        `;
      })
      .join('');

    card.innerHTML = `
      <div class="graduate-main">
        <h3>${graduate.name}</h3>
        <p class="graduate-nickname ${nicknameClass} ${noWrapNicknameClass}">『${graduate.nickname || '未入力'}』</p>
        <p><strong>大学:</strong> ${graduate.university || '未入力'}</p>
        <p><strong>生年月日:</strong> ${normalizeBirthdate(graduate.birthdate)}</p>
        <p class="graduate-description">${graduate.description || 'ここに紹介文を入力してください。'}</p>
      </div>
      <div class="graduate-photos">
        ${photoSlots}
      </div>
    `;

    graduateProfiles.appendChild(card);
  });

  graduateProfiles.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement)) return;
    if (!target.closest('.graduate-photo-slot.has-image')) return;
    const modalIndex = registerModalPhoto(target);
    openPhotoModalByIndex(modalIndex);
  });
}
