import qs from "qs"
const { EMBEDLY_KEY, EMBEDLY_ENDPOINT } = process.env

export default (src, mode, width, height) => {
  const options = {
    crop: {
      url: src,
      width,
      height,
      key: EMBEDLY_KEY,
      quality: 80,
    },
    resize: {
      grow: false,
      url: src,
      width,
      height,
      key: EMBEDLY_KEY,
      quality: 80,
    },
  }

  return `${EMBEDLY_ENDPOINT}/${mode}?${qs.stringify(options[mode])}`
}