import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import SiteNav from '@/components/landing/SiteNav'
import SiteFooter from '@/components/landing/SiteFooter'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <>
        <SiteNav />
        <RouterView />
        <div class="bg-primary">
          <SiteFooter />
        </div>
      </>
    )
  },
})
