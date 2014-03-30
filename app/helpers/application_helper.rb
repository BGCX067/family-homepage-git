module ApplicationHelper
  
  # http://stackoverflow.com/questions/3705898/best-way-to-add-current-class-to-nav-in-rails-3
  def nav_tabs(tabs=[], admin)
    return if tabs.nil?
    html = []
    path = request.fullpath.split(/[\??]/)[0]
    path = welcome_path if path == root_path
    tabs.each do |tab|
      css = admin ? "admin" : ""
      css = (path == tab[:path] ? "active " + css : css)
      html << (content_tag :li, link_to(tab[:name], tab[:path]), :class => css)
      css = ""
    end
    
    html.join.html_safe
  end

  # def nav_admin_tabs(tabs = [])
    # html = []
    # tabs.each do |tab|
    # #params[:controller]
      # css = "admin " + ("active" if request.fullpath.split(/[\??]/)[0] == tab[:path])
      # html << (content_tag :li, link_to(tab[:name], tab[:path]), :class => css)
    # end
# 
    # html.join.html_safe
  # end

end
