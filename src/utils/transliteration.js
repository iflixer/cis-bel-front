const transliterationMap = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
  'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'Yo',
  'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
  'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
  'Ф': 'F', 'Х': 'H', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch',
  'Ъ': '', 'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
};

export function transliterate(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return text
    .replace(/[А-Яа-яё]/g, (char) => transliterationMap[char] || char)
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

export const transliterationMixin = {
  data() {
    return {
      autoTransliterate: true
    };
  },
  methods: {
    transliterate,

    setupAutoTransliteration(sourceField, targetField) {
      this.$watch(sourceField, (newVal) => {
        if (this.autoTransliterate && newVal) {
          const targetPath = targetField.split('.');
          let obj = this;
          for (let i = 0; i < targetPath.length - 1; i++) {
            obj = obj[targetPath[i]];
          }
          obj[targetPath[targetPath.length - 1]] = this.transliterate(newVal);
        }
      });
    },

    disableAutoTransliteration() {
      this.autoTransliterate = false;
    },

    enableAutoTransliteration() {
      this.autoTransliterate = true;
    }
  }
};

export default {
  transliterate,
  transliterationMixin
};