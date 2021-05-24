<template>
  <base-content>
    <div style="display: flex;justify-content: center">
      <div style="margin: 0 auto;max-width: 1200px;">
        <h3>Read Later</h3>
        <template>
          <q-list>
            <q-item v-for="item in readLaterList" :key="item.id" clickable>
              <q-item-section top thumbnail class="q-ml-none">
<!--                <img :src="item.firstImgUrl" v-if="item.firstImgUrl">-->
<!--                <img src="../../assets/defaultImage.jpg" alt="" v-else>-->
                <q-icon name="rss_feed" color="black" size="34px" />
              </q-item-section>

              <q-item-section @click="openRSSPad(item)">
                <q-item-label>{{item.title}}</q-item-label>
                <q-item-label style="font-size: 12px;color: lightgray;">{{item.feed_name}}</q-item-label>
                <q-item-label caption lines="2">{{item.description | deleteHtmlTag}}</q-item-label>
              </q-item-section>

              <q-item-section side top>
                <q-item-label caption>{{item.pub_date | filterTime}}</q-item-label>
              </q-item-section>
              <q-item-section side top>
                <q-btn icon="link" flat dense round @click="gotoLink(item.link)"></q-btn>
                <q-btn icon="watch_later" flat dense round @click="deleteLaterItem(item.link)"></q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </template>
      </div>
    </div>
  </base-content>
</template>

<script>
/* eslint-disable */
import BaseContent from '../../components/BaseContent/BaseContent'
export default {
  name: 'menu-1-2',
  components: { BaseContent },
  data () {
    return {
      msg: '稍后阅读',
      readLaterList:[]
    }
  },
  methods: {
    getReadLaterList() {
      var query = {
        url: '/readLater/getItems'
      }
      this.$fetchData(query).then( res => {
        if (res.data.error_code === 0) {
          this.readLaterList = res.data.data.laterItems
          // console.log(this.readLaterList);
          for(let i = 0;i<this.readLaterList.length;i++){
            this.readLaterList[i].firstImgUrl = this.getFirstPic(this.readLaterList[i].description)
            console.log(this.readLaterList[i]);
          }
        }
      })
    },
    getFirstPic(str) {
      let data = ''
      str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/, function(match, capture) {
        data = capture
      })
      return data
    },
    openRSSPad (item) {
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
    deleteLaterItem(link){
      var query = {
        url: '/readLater/deleteItem',
        params: {
          link:link
        }
      }
      this.$fetchData(query).then(res => {
        if(res.data.error_code===0){
          // this.LaterTitles.splice(this.LaterTitles.indexOf(title),1);
          this.getReadLaterList()
        }
      })
    }
  },
  created() {
    this.getReadLaterList()
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
