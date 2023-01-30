import { Router } from "vue-router"

const goBack = (router: Router) => {
  router.back()
}

const routerTo = (router: Router, to: string) => {
  router.push(to)
}

const openNewTab = (url: string) => {
  window.open(url, "_blank")
}

export { goBack, routerTo, openNewTab }
