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

const kickoffDate = new Date('2026-03-14T16:30:00+09:00');
const dayEl = document.getElementById('days');
const hourEl = document.getElementById('hours');
const minEl = document.getElementById('minutes');

const updateCountdown = () => {
  if (!dayEl || !hourEl || !minEl) return;
  const now = new Date();
  const diff = kickoffDate.getTime() - now.getTime();

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
const photoArchiveSection = document.getElementById('photoarchive');
const photoModal = document.getElementById('photo-modal');
const photoModalImage = document.getElementById('photo-modal-image');
const photoModalClose = document.getElementById('photo-modal-close');

const openPhotoModal = (src, alt) => {
  if (!photoModal || !photoModalImage) return;
  photoModalImage.src = src;
  photoModalImage.alt = alt;
  photoModal.classList.add('open');
  photoModal.setAttribute('aria-hidden', 'false');
};

const closePhotoModal = () => {
  if (!photoModal || !photoModalImage) return;
  photoModal.classList.remove('open');
  photoModal.setAttribute('aria-hidden', 'true');
  photoModalImage.src = '';
};

if (photoModalClose) {
  photoModalClose.addEventListener('click', closePhotoModal);
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
    img.addEventListener('click', () => openPhotoModal(img.src, img.alt));

    figure.appendChild(img);
    gallery.appendChild(figure);
  }
};

const renderPhotoGalleryRange = ({ gallery, start, end, directory, altPrefix }) => {
  if (!gallery) return;
  for (let i = start; i <= end; i += 1) {
    const num = String(i).padStart(3, '0');
    const figure = document.createElement('figure');
    figure.className = 'photo-card';

    const img = document.createElement('img');
    img.src = `./assets/${directory}/${num}.jpg`;
    img.alt = `${altPrefix} ${i}`;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('click', () => openPhotoModal(img.src, img.alt));

    figure.appendChild(img);
    gallery.appendChild(figure);
  }
};

let photoArchiveRendered = false;
const renderPhotoArchive = () => {
  if (photoArchiveRendered) return;
  photoArchiveRendered = true;

  renderPhotoGalleryRange({
    gallery: fourthYearGallery,
    start: 1,
    end: 50,
    directory: 'photowall-2nd',
    altPrefix: 'ANFINI 4th-year photo',
  });

  renderPhotoGalleryRange({
    gallery: thirdYearGallery,
    start: 51,
    end: 100,
    directory: 'photowall-2nd',
    altPrefix: 'ANFINI 3rd-year photo',
  });

  renderPhotoGalleryRange({
    gallery: secondYearGallery,
    start: 101,
    end: 145,
    directory: 'photowall-2nd',
    altPrefix: 'ANFINI 2nd-year photo',
  });

  renderPhotoGallery({
    gallery: firstYearGallery,
    photoCount: 125,
    directory: 'photowall-1st',
    altPrefix: 'ANFINI 1st-year photo',
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

const aboutReelPhotos = document.querySelectorAll('.about-reel .about-reel-photo');
aboutReelPhotos.forEach((photo, index) => {
  photo.style.zIndex = String(index + 1);
});

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
    磯崎友希: 'assets/movies/isozaki-yuki.mp4',
    三浦航大: 'assets/movies/miura-kodai.mp4',
    奥原沙理: 'assets/movies/okuhara-sari.mp4',
    小玉拓未: 'assets/movies/kodama-takumi.mp4',
  };
  const personalMovieSongs = {
    永樂心優: '未入力',
    成本茉莉: '未入力',
    西田典立: '妖怪体操第一',
    辻拓真: '水曜日のダウンタウンOP',
    小比賀華子: '未入力',
    岩佐茅咲: '未入力',
    種谷響希: 'Super Ocean Man',
    三浦航大: '未入力',
    木村遥輝: '未入力',
    田中柚希: '未入力',
    園田響己: '未入力',
    大澤夏海: '未入力',
    奥原沙理: '未入力',
    久保田圭祐: '未入力',
    長谷川斗空: '未入力',
    布山達也: '完全感覚DREAMER',
    磯崎友希: '-',
    小玉拓未: 'はじまり',
    堀内うらら: '未入力',
    陣内海璃: 'imagine if',
    荒岡美夢: '未入力',
    島田紗千: '未入力',
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
        '香川県産の規格外のギャル。とにかくうんぴすの絵文字が好きすぎる。かわいらしい顔面とは裏腹にアルハラもしばしば。',
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
      nickname: 'アンストッパブルな<br>イカれキャプテン',
      photos: [
        'assets/graduates/tanetani-1.jpg',
        'assets/graduates/tanetani-2.jpg',
        'assets/graduates/tanetani-3.jpg',
      ],
      description:
        '言わずと知れたAnfini28thの会長。ホームベース顔が特徴的。「京大のルカク」との異名も持つ。コイツはサッカーでも飲み会でも止められない。サッカーではフィジカルで縦突破。正直めちゃくちゃ頼りでした。打って変わって飲み会では目パキ。宴会で戦えない奴にはブチギレ。最近はその様子が加速したのか、トラブルの種になりがちなのかもしれない。でも俺は知ってる。こいつはええやつ。',
    },
    {
      name: '三浦航大',
      university: '京都大学法学部',
      birthdate: '2002.04.13',
      nickname: '重すぎる体、軽すぎる口',
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
      photos: [
        'assets/graduates/tanaka-1.jpg',
        'assets/graduates/tanaka-2.jpg',
        'assets/graduates/tanaka-3.jpg',
      ],
    },
    {
      name: '園田響己',
      university: '同志社商学部',
      birthdate: '2004/03.04',
      nickname: 'お世話になりました。',
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
        'Anfini28th の副キャプテン。サッカーでの安定感は異常。この人の左足は一級品。飲み会でも熱量一緒。サッカーの時よりもコールの声でかい。',
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
        <p class="graduate-nickname ${nicknameClass}">『${graduate.nickname || '未入力'}』</p>
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
    openPhotoModal(target.src, target.alt);
  });
}
