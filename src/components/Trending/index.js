import {useContext, useEffect, useState} from 'react'
import Cookies from "js-cookie";
import {HiFire} from 'react-icons/hi'
import NxtThemeContext from '../Context'
import {
  TrendingVideosContainer,
  SideBarAndContentContainer,
  TrendingVideosContentContainer,
  TrendingVideosBanner,
  TrendingLogoContainer,
  TrendingTitle,
  TrendingVideosList,
} from './StyledComponents'

import Header from '../Header'
import SideBar from '../SideBar'
import LoaderBox from '../LoaderBox'
import VideoItem from '../VideoItem'

const apiStatus = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

export default function TrendingVideos() {
  const [trendingVideos, setTrendingVideos] = useState([])
  const [status, setStatus] = useState(apiStatus.failure)
  const {isDarkTheme} = useContext(NxtThemeContext)

  useEffect(()=> getTrendingVideos(),[])

  const updateData = data => ({
    channel: {
      name: data.channel.name,
      profileImageUrl: data.channel.profile_image_url,
    },
    id: data.id,
    publishedAt: data.published_at,
    thumbnailUrl: data.thumbnail_url,
    title: data.title,
    viewCount: data.view_count,
  })

  const getTrendingVideos = ()=>{
    const fetchVideos = async () => {
    setStatus(apiStatus.loading)
    const url = 'https://apis.ccbp.in/videos/trending'
    const jwtToken = Cookies.get("jwt_token");
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      };
    const response = await fetch(url,options)
    const data = await response.json()
    if (response.ok) {
      const fetchedData = data.videos.map(eachItem => updateData(eachItem))
      setStatus(apiStatus.success)
      setTrendingVideos(fetchedData)
    } else {
        setStatus(apiStatus.failure)
    }
  }
  fetchVideos()
  }
  const switchRender = () => {
    switch (status) {
      case 'LOADING':
        return <LoaderBox />
      case 'SUCCESS':
        return (
          <TrendingVideosContentContainer>
            <TrendingVideosBanner data-testid="banner" theme={isDarkTheme}>
              <TrendingLogoContainer theme={isDarkTheme}>
                <HiFire />
              </TrendingLogoContainer>
              <TrendingTitle theme={isDarkTheme}>Trending Videos</TrendingTitle>
            </TrendingVideosBanner>
            <TrendingVideosList>
              {trendingVideos.map(eachItem => (
                <VideoItem key={eachItem.id} details={eachItem} />
              ))}
            </TrendingVideosList>
          </TrendingVideosContentContainer>
        )
      case 'FAILURE':
        return <LoaderBox />
      default:
        return null
    }
  }

          return (
            <TrendingVideosContainer theme={isDarkTheme} data-testid="trending">
              <Header />
              <SideBarAndContentContainer>
                <SideBar />
                {switchRender()}
              </SideBarAndContentContainer>
            </TrendingVideosContainer>
          )
        }
