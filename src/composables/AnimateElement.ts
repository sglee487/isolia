function useAnimateElement (element: Element) {
  const animateClasses = [
    'animate__animated',
    'animate__headShake',
    'animate__fast'
  ]

  element.classList.add(...animateClasses)
  element.addEventListener('animationend', () => {
    element.classList.remove(...animateClasses)
  })
}

export default useAnimateElement
