<template>

  <base-content>
    <q-ajax-bar
      ref="bar"
      position="bottom"
      color="accent"
      size="30px"
      skip-hijack
    />

    <div class="container flex justify-center" style="margin-top: 30px;">
      <div style="width: 1000px;">
        <h3 style="margin-bottom: 10px;margin-left: 10px;margin-top: 0px">Today</h3>
        <p style="margin-left: 10px;font-size: 20px;color: slategrey">The insights you need to keep ahead
        </p>
        <div style="width: 1200px;">
          <div style="width: 500px;margin: 20px;float: left;" v-for="feed in TodayFeedList" :key="feed.title">
            <q-card class="my-card">
              <q-card-section>
                <div class="text-h6">{{feed.title}}</div>
<!--                <div class="text-subtitle2">by John Doe</div>-->
              </q-card-section>

              <q-separator />

              <q-card-actions vertical>
                <q-list>
                  <q-item v-for="item in feed.items" :key="item.title" class="feeditems" style="border-radius: 10px;" clickable>
                    <q-item-section @click="openRSSPad(item)" style="cursor:pointer;">
                      <q-item-label>{{item.title}}</q-item-label>
                      <q-item-label caption lines="2">{{item.description | deleteHtmlTag}}</q-item-label>
                    </q-item-section>
                    <div style="height: 50px;">
                      <q-item-label caption>{{item.pubDate|filterTime}}</q-item-label>
                      <div>
                        <q-btn class="gt-xs" size="12px" flat dense round icon="link"  @click="gotoLink(item.originalLink)"/>
                      </div>
                    </div>
                  </q-item>
                  <q-separator spaced inset />
                </q-list>
<!--                <q-btn flat>Action 1</q-btn>-->
<!--                <q-btn flat>Action 2</q-btn>-->
              </q-card-actions>
            </q-card>
          </div>
        </div>
<!--        <template>-->
<!--          <div class="q-pa-md" style="max-width: 1000px;" v-for="feed in TodayFeedList" :key="feed.title">-->
<!--            <div style="margin: 0px;font-size: 26px;margin-left: 20px">{{feed.title}}</div>-->
<!--            <q-list>-->
<!--              <q-item v-for="item in feed.items" :key="item.title" class="feeditems" style="border-radius: 10px;" clickable>-->
<!--                <q-item-section @click="openRSSPad(item)" style="cursor:pointer;">-->
<!--                  <q-item-label>{{item.title}}</q-item-label>-->
<!--                  <q-item-label caption lines="2">{{item.description | deleteHtmlTag}}</q-item-label>-->
<!--                </q-item-section>-->
<!--                <div style="height: 50px;">-->
<!--                  <q-item-label caption>{{item.pubDate|filterTime}}</q-item-label>-->
<!--                  <div>-->
<!--                    <q-btn class="gt-xs" size="12px" flat dense round icon="link"  @click="gotoLink(item.originalLink)"/>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </q-item>-->
<!--              <q-separator spaced inset />-->
<!--            </q-list>-->
<!--          </div>-->
<!--        </template>-->
      </div>
    </div>
  </base-content>

</template>

<script>
/* eslint-disable */
// import countTo from 'vue-count-to'
import BaseContent from '../../components/BaseContent/BaseContent'
// import { thumbStyle } from '../../components/BaseContent/thumbStyle'
// import chartPie from '../../assets/js/echarts-1'
// import charts2Option from '../../assets/js/echarts-2'
// import { income, expense, total } from '../../assets/js/echarts-3'
// import chartZ from '../../assets/js/echarts-4'
// import { Dark } from 'quasar'
import { QAjaxBar } from 'quasar'
// import RSSPad from '../../components/RSSPad/RSSPad'
export default {
  name: 'home',
  components: {
    BaseContent,
    QAjaxBar,
    // RSSPad
    // countTo
  },
  data () {
    return {
      TodayFeedList: [],
      showRSSPad: false,
      LaterLinks:[]
    }
  },
  methods: {
    getTodayFeed () {
      var query = {
        url: '/feed/getFeed'
      }
      this.$fetchData(query).then(res => {
        if (res.data.error_code === 0) {
          this.TodayFeedList = res.data.data.feeds
        }
      })
    },
    openRSSPad (item) {
      // let url = item.origin_link
        // <div class='linkBtn' onclick='window.open(url)'>VISIT WEBSITE</div>
      var loaded_html = "<div style='display: flex;justify-content: center;min-width:1000px'><div style='max-width: 900px;min-width: 800px;' class='RSSPad'>"+item.description+"</div></div>"
      var style = "<style>.RSSPad img{max-width: 600px} .linkBtn{cursor: pointer;width: 150px;height: 30px;border-radius: 15px;border: 1px solid lightgrey;text-align: center;line-height: 30px}</style>"
      loaded_html += style;
      this.$q.dialog({
        title: item.title,
        message: loaded_html,
        html: true,
        style: "max-width:1600px;width:1200px;min-width:1000px"
      }).onOk(() => {
        // console.log('OK')
      }).onCancel(() => {
        // console.log('Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    gotoLink(url){
      window.open(url)
    },
    addLaterItem(item){
      var query = {
        url: '/readLater/add_item',
        params: {
          link: item.originalLink
        }
      }
      this.$fetchData(query).then(res => {
        if(res.data.error_code===0){
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '已添加至稍后读!',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
          this.LaterLinks.push(item.originalLink)
        }
      });
    },
    getLaterLinks(){
      var query = {
        url: '/readLater/getLinks'
      }
      this.$fetchData(query).then(res => {
        if(res.data.error_code === 0){
          this.LaterLinks = res.data.data
        }
      })
    },
    deleteLaterItem(link){
      var query = {
        url: '/readLater/deleteItem',
        params: {
          link:link
        }
      }
      this.$fetchData(query).then(res => {
        if(res.data.error_code===0){
          this.LaterTitles.splice(this.LaterTitles.indexOf(title),1);
        }
      })
    }
  },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length > 50) {
        return value.slice(0, 50) + '...'
      }
      return value
    },
    filterTime(old){
      let now=new Date().getTime();
      let old_time = Date.parse(old);
      let time=now-old_time;
      let str=''
      if(time>=0&&time<1000*60){
        str='刚刚'
      }else if(time>=1000*60&&time<1000*60*2){
        str='1分钟前'
      }else if(time>=1000*60*2&&time<1000*60*3){
        str='2分钟前'
      }else if(time>=1000*60*3&&time<1000*60*60){
        str='1小时前'
      }else if(time>=1000*60*60&&time<1000*60*60*2){
        str='2小时前'
      }else if(time>=1000*60*60*2&&time<1000*60*60*24){
        str='好几个小时前'
      }else if(time>=1000*60*60*24&&time<1000*60*60*24*2){
        str='1天前'
      }else if(time>=1000*60*60*24*2&&time<1000*60*60*24*3){
        str='2天前'
      }else if(time>=1000*60*60*24*3&&time<1000*60*60*24*30){
        str='1月前'
      }else{
        str=old
      }
      return str
    },
    deleteHtmlTag (str) {
      return str.replace(/<[^>]+>/g,"");
    }
},
  created () {
    this.getTodayFeed()
    // this.getLaterLinks()
  }
}
</script>
<style lang="css" scoped>
.feeditems:hover {

    background-color: lightgray;
}
.RSSPad img{
  max-width: 800px;
}
</style>
