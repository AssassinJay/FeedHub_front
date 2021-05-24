<template>
  <base-content>
    <h4 style="margin-left: 20px">ALL Personal Feeds</h4>
    <div style="display: flex; justify-content: center;float: left;">
      <div class="q-pa-md" style="max-width: 350px;">
        <q-list bordered separator>
          <q-item clickable v-ripple v-for="(RSS,index) in RSSList" :key="RSS.feed_url" @click="getFeedContent(index)" :active="nowIndex === index">
            <q-item-section>
              <q-item-label>{{RSS.feed_name}}</q-item-label>
              <q-item-label caption>{{RSS.feed_url}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-separator vertical inset v-if="true"/>
      <div style="margin-left: 15px;">
      <q-list bordered class="rounded-borders" style="max-width: 1100px;min-width: 800px;">
        <q-item-label header>{{RSSContent.title}}</q-item-label>
        <q-item v-for="item in RSSContent.items" :key="item.title" clickable v-ripple>
          <q-item-section avatar top>
            <q-icon name="rss_feed" color="black" size="34px" />
          </q-item-section>
          <q-item-section top class="col-1">
            <q-item-label class="q-mt-sm" style="width: 100px;max-width: 100px" v-if="doneUrlList.indexOf(item.originalLink)<=-1">{{RSSList[nowIndex].souce_name}}</q-item-label>
            <q-item-label class="q-mt-sm" style="width: 100px;max-width: 100px;color: lightgray;" v-else>{{RSSList[nowIndex].souce_name}}</q-item-label>
          </q-item-section>
          <q-item-section top>
            <div @click="openRSSPad(item)">
              <q-item-label lines="1" >
                <span class="text-weight-medium" v-if="doneUrlList.indexOf(item.originalLink)<=-1">{{item.title | ellipsis}}</span>
                <span class="text-weight-medium" style="color: lightgray;" v-else>{{item.title | ellipsis}}</span>
                <span class="text-grey-8" style="float: right;" v-if="doneUrlList.indexOf(item.originalLink)<=-1">{{item.pubDate | filterTime}}</span>
                <span class="text-grey-8" style="float: right;color: lightgray;" v-else>{{item.pubDate | filterTime}}</span>
              </q-item-label>
              <q-item-label caption lines="2" v-if="doneUrlList.indexOf(item.originalLink)<=-1">
                {{item.description | deleteHtmlTag}}
              </q-item-label>
              <q-item-label caption lines="2" style="color: lightgray;" v-else>
                {{item.description | deleteHtmlTag}}
              </q-item-label>
            </div>
            <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase" @click="gotoLink(item.originalLink)">
              <span class="cursor-pointer" v-if="doneUrlList.indexOf(item.originalLink)<=-1">VISIT WEBSITE</span>
              <span class="cursor-pointer" style="color: lightgray;" v-else>VISIT WEBSITE</span>
            </q-item-label>
          </q-item-section>
          <q-item-section top side>
            <div class="text-grey-8 q-gutter-xs">
              <q-btn class="gt-xs" size="12px" flat dense round icon="schedule" @click="addLaterItem(item)" v-if="LaterLinks.indexOf(item.originalLink)<=-1" />
              <q-btn class="gt-xs" size="12px" flat dense round icon="watch_later" @click="deleteLaterItem(item.originalLink)" v-else />
              <q-btn class="gt-xs" size="12px" flat dense round icon="done" @click="readDone(item.originalLink)" v-if="doneUrlList.indexOf(item.originalLink)<=-1"/>
              <q-btn class="gt-xs" size="12px" flat dense round icon="close" @click="cancelReadDone(item.originalLink)" v-else/>
<!--              <q-btn size="12px" flat dense round icon="more_vert" />-->
            </div>
          </q-item-section>
        </q-item>

      </q-list>
      </div>
    </div>
  </base-content>
</template>

<script>
/* eslint-disable */
import BaseContent from '../../components/BaseContent/BaseContent'
export default {
  name: 'menu-1-1-1',
  components: {
    BaseContent
  },
  data () {
    return {
      RSSList: [],
      RSSContent: {},
      nowIndex: 0,
      doneUrlList:[],
      LaterLinks:[]
    }
  },
  methods: {
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
          // console.log(this.LaterLinks)
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
          // console.log(this.LaterLinks)
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
          this.LaterLinks.splice(this.LaterLinks.indexOf(link),1);
        }
      })
    },
    getDoneUrlList(){
      var query = {
        url:"/feed/getDoneUrl"
      }
      this.$fetchData(query).then(res=>{
        if (res.data.error_code === 0) {
          this.doneUrlList = res.data.data.doneUrlList
        }
      })
    },
    cancelReadDone(link){
      var query = {
        url:"/feed/deleteAccountItems",
        params:{
          feed_url:link
        }
      }
      this.$fetchData(query).then(res=>{
        if(res.data.error_code===0){
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '已取消！',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
          this.doneUrlList.splice(this.doneUrlList.indexOf(link),1)
        }
      })
    },
    readDone(link){
      var query = {
        url:"/feed/addAccountItems",
        params:{
          feed_url:link
        }
      }
      this.$fetchData(query).then(res=>{
        if(res.data.error_code===0){
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '已标记！',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
          this.doneUrlList.push(link)
        }
      })
    },
    getFeedContent (index) {
      this.nowIndex = index
      var query = {
        url: '/feed/getFeedByUrl',
        params: {
          feedUrl: this.RSSList[index].feed_url,
          isRSSHub: this.RSSList[index].isRSSHub
        }
      }
      this.$fetchData(query).then(res => {
        if (res.data.error_code === 0) {
          this.RSSContent = res.data.data.FeedItems.feeds
        }
      })
    },
    getRSSList () {
      var query = {
        url: '/feed/getRSSList'
      }
      this.$fetchData(query).then(res => {
        if (res.data.error_code === 0) {
          this.RSSList = res.data.data.RSSList
          this.getFeedContent(0)
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
    }
  },
  created () {
    this.getRSSList()
    this.getDoneUrlList()
    this.getLaterLinks()
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
}
</script>
