import { Router } from "vue-router"

const goBack = (router: Router) => {
  router.back()
}

const routerTo = (router: Router, to: string) => {
  router.push(to)
}

export { goBack, routerTo }
